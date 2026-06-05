import type { Upload } from "./types";

/**
 * A row in the read selector list: either a single file or a detected mate
 * pair. For a pair, `left` is the R1 (LEFT) read and `right` is the R2 (RIGHT)
 * read.
 */
export type ReadRow =
	| { kind: "single"; file: Upload }
	| { kind: "pair"; key: string; left: Upload; right: Upload };

/**
 * The result of detecting a mate token in a filename: the shared `stem` (the
 * name with the mate digit replaced by a sentinel, so true mates share it) and
 * which side of the pair the file is (`1` = R1/LEFT, `2` = R2/RIGHT).
 */
type Mate = { stem: string; side: 1 | 2 };

const MATE_TOKEN = "#";

/**
 * Mate-token patterns in priority order. Each captures a single `1`/`2` digit.
 * The prefixes (`_R`, `_`, `.`) contain no digits, so the captured digit's
 * position can be located within the match.
 */
const MATE_PATTERNS = [
	/_R([12])(?=[._]|$)/i,
	/_([12])(?=[._]|$)/,
	/\.([12])\./,
];

/**
 * Detects a paired-read mate token in a filename. Returns the shared stem and
 * the file's side, or `null` when no recognised token is present. Bare `L`/`R`
 * conventions are deliberately not recognised — they are too ambiguous to pair
 * confidently.
 *
 * @param name - the filename to inspect
 */
export function detectMate(name: string): Mate | null {
	for (const pattern of MATE_PATTERNS) {
		const match = pattern.exec(name);

		if (match) {
			const side = Number(match[1]) as 1 | 2;
			const digitIndex = match.index + match[0].indexOf(match[1]);
			const stem =
				name.slice(0, digitIndex) + MATE_TOKEN + name.slice(digitIndex + 1);

			return { stem, side };
		}
	}

	return null;
}

/**
 * Groups read uploads into selector rows, collapsing detected mate pairs into a
 * single pair row. A pair is two files whose names are identical except for the
 * mate token. Lone mates, ambiguous groups (three or more files sharing a
 * stem), and files with no recognised token all render as single rows. Rows
 * follow the order of the input list; a pair takes the position of its
 * first-encountered member.
 *
 * @param files - the read uploads to group
 */
export function buildReadRows(files: Upload[]): ReadRow[] {
	const mates = new Map<number, Mate>();
	const byStem = new Map<string, Upload[]>();

	for (const file of files) {
		const mate = detectMate(file.name);

		if (mate) {
			mates.set(file.id, mate);
			const group = byStem.get(mate.stem) ?? [];
			group.push(file);
			byStem.set(mate.stem, group);
		}
	}

	const pairByStem = new Map<string, { left: Upload; right: Upload }>();

	for (const [stem, group] of byStem) {
		if (group.length !== 2) {
			continue;
		}

		const [first, second] = group;
		const firstSide = mates.get(first.id)?.side;
		const secondSide = mates.get(second.id)?.side;

		if (firstSide !== secondSide) {
			const left = firstSide === 1 ? first : second;
			const right = firstSide === 1 ? second : first;
			pairByStem.set(stem, { left, right });
		}
	}

	const rows: ReadRow[] = [];
	const emitted = new Set<number>();

	for (const file of files) {
		if (emitted.has(file.id)) {
			continue;
		}

		const mate = mates.get(file.id);
		const pair = mate && pairByStem.get(mate.stem);

		if (pair) {
			rows.push({
				kind: "pair",
				key: mate.stem,
				left: pair.left,
				right: pair.right,
			});
			emitted.add(pair.left.id);
			emitted.add(pair.right.id);
		} else {
			rows.push({ kind: "single", file });
			emitted.add(file.id);
		}
	}

	return rows;
}
