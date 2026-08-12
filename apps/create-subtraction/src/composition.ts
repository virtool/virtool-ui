/**
 * The nucleotide scan behind `compute_gc_and_count`.
 *
 * Python's version, term for term. It is **not** a FASTA parse: a line beginning
 * `>` bumps the count and every other line is tallied character by character,
 * with no record ever assembled. Keeping it that way is both what makes the
 * figures identical and what keeps a chromosome off the heap — a FASTA parser
 * joins each record into one string, and a large genome's is hundreds of
 * megabytes for nothing.
 */

import { roundHalfEven } from "@virtool/bio";
import type { NucleotideComposition } from "@virtool/contracts";

/** The nucleotides tallied, and the keys `gc` is reported under. */
const NUCLEOTIDES = ["a", "t", "g", "c", "n"] as const;

type Nucleotide = (typeof NUCLEOTIDES)[number];

/** Places `gc` is rounded to, matching Python's `round(ratio, 3)`. */
const GC_PLACES = 3;

/** What one pass over a decompressed genome yields. */
export type GenomeComposition = {
	/** Sequences seen, one per header line. */
	count: number;

	/** Each nucleotide's share of the five tallied, rounded to three places. */
	gc: NucleotideComposition;
};

/**
 * Count sequences and nucleotides in a decompressed FASTA.
 *
 * **The denominator is the five counters' sum, not the sequence length.**
 * Python sums `nucleotides.values()`, so an IUPAC ambiguity code contributes to
 * neither side of the ratio and the five shares still total one. Reproducing
 * that is the difference between matching Python's `gc` and merely being close
 * to it.
 *
 * Rounding is half-to-even, which is Python's `round`. `Math.round` is
 * half-up, so the two disagree on a ratio landing exactly on a half at the
 * third place.
 *
 * @throws {Error} when the file holds none of the five nucleotides, where
 *   Python divides by zero.
 */
export async function computeComposition(
	lines: AsyncIterable<string>,
): Promise<GenomeComposition> {
	const tally: Record<Nucleotide, number> = { a: 0, t: 0, g: 0, c: 0, n: 0 };

	let count = 0;

	for await (const line of lines) {
		if (line.startsWith(">")) {
			count += 1;

			continue;
		}

		if (line === "") {
			continue;
		}

		const lowered = line.toLowerCase();

		for (const nucleotide of NUCLEOTIDES) {
			tally[nucleotide] += countOccurrences(lowered, nucleotide);
		}
	}

	const total = NUCLEOTIDES.reduce(
		(sum, nucleotide) => sum + tally[nucleotide],
		0,
	);

	if (total === 0) {
		throw new Error(
			"Genome holds no nucleotides; the source file is empty or is not a FASTA",
		);
	}

	return {
		count,
		gc: {
			a: roundHalfEven(tally.a / total, GC_PLACES),
			t: roundHalfEven(tally.t / total, GC_PLACES),
			g: roundHalfEven(tally.g / total, GC_PLACES),
			c: roundHalfEven(tally.c / total, GC_PLACES),
			n: roundHalfEven(tally.n / total, GC_PLACES),
		},
	};
}

/**
 * Occurrences of a single character, the way Python's `str.count` counts them.
 *
 * `split` would allocate an array the width of the line on each of the five
 * passes; this walks it instead.
 */
function countOccurrences(line: string, character: string): number {
	let occurrences = 0;

	for (let index = line.indexOf(character); index !== -1; ) {
		occurrences += 1;
		index = line.indexOf(character, index + 1);
	}

	return occurrences;
}
