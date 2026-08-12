import { describe, expect, it } from "vitest";
import { computeComposition } from "./composition";

async function* lines(...values: string[]): AsyncGenerator<string> {
	for (const value of values) {
		yield value;
	}
}

describe("computeComposition", () => {
	it("counts one sequence per header line", async () => {
		const { count } = await computeComposition(
			lines(">one", "atgc", ">two", "atgc", ">three", "atgc"),
		);

		expect(count).toBe(3);
	});

	it("reports each nucleotide's share of the genome", async () => {
		const { gc } = await computeComposition(lines(">one", "aattggccnn"));

		expect(gc).toEqual({ a: 0.2, t: 0.2, g: 0.2, c: 0.2, n: 0.2 });
	});

	it("tallies sequence lines regardless of case", async () => {
		const { gc } = await computeComposition(lines(">one", "AaTtGgCcNn"));

		expect(gc).toEqual({ a: 0.2, t: 0.2, g: 0.2, c: 0.2, n: 0.2 });
	});

	it("accumulates a sequence wrapped over several lines", async () => {
		const wrapped = await computeComposition(lines(">one", "aatt", "ggccnn"));
		const flat = await computeComposition(lines(">one", "aattggccnn"));

		expect(wrapped).toEqual(flat);
	});

	it("ignores blank lines", async () => {
		const { count, gc } = await computeComposition(
			lines(">one", "", "aattggccnn", ""),
		);

		expect(count).toBe(1);
		expect(gc).toEqual({ a: 0.2, t: 0.2, g: 0.2, c: 0.2, n: 0.2 });
	});

	// Python divides by `sum(nucleotides.values())`, not by the sequence length.
	// An ambiguity code is in neither the numerator nor the denominator, so the
	// five shares still total one. Dividing by the length instead would report
	// every share low by the same factor.
	it("excludes an ambiguity code from the denominator", async () => {
		const { gc } = await computeComposition(lines(">one", "atgcryswkm"));

		expect(gc).toEqual({ a: 0.25, t: 0.25, g: 0.25, c: 0.25, n: 0 });
	});

	// `Math.round(0.0625 * 1000) / 1000` is 0.063; Python's `round(0.0625, 3)`
	// is 0.062, because it breaks a tie toward the even digit. A genome landing
	// on one of these is what the two implementations would disagree about.
	it("rounds a half-way ratio to even, as Python does", async () => {
		// 1/16 = 0.0625 exactly, and 3/16 = 0.1875 exactly: two ties, rounding in
		// opposite directions.
		const { gc } = await computeComposition(
			lines(">one", "a".repeat(1), "t".repeat(3), "g".repeat(6), "c".repeat(6)),
		);

		expect(gc.a).toBe(0.062);
		expect(gc.t).toBe(0.188);
	});

	// Python's own fixture, mixing upper and lower case deliberately: `seqkit
	// fx2tab --base-count` ignores case, as the lowercasing here does. Matching it
	// is what says this scan and that tool are interchangeable.
	it("matches Python's mixed-case fixture", async () => {
		const { count, gc } = await computeComposition(
			lines(">seq_1", "ATGCATGCNN", ">seq_2", "atgcatgcat"),
		);

		expect(count).toBe(2);
		expect(gc).toEqual({ a: 0.25, t: 0.25, g: 0.2, c: 0.2, n: 0.1 });
	});

	// Python raises for each separately, in this order, rather than dividing by
	// zero.
	it("refuses a file holding no sequences", async () => {
		await expect(computeComposition(lines(""))).rejects.toThrow(
			"No sequences found in subtraction FASTA",
		);
	});

	it("refuses sequences holding none of the five bases", async () => {
		await expect(computeComposition(lines(">seq_1", "RYKM"))).rejects.toThrow(
			"No A, T, G, C, or N bases found in subtraction FASTA",
		);
	});
});
