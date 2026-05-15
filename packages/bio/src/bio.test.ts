import { describe, expect, it } from "vitest";
import {
	findOrfs,
	parseFasta,
	parseFastq,
	reverseComplement,
	translate,
} from "./bio";

describe("reverseComplement", () => {
	it("complements and reverses A/T/G/C", () => {
		expect(reverseComplement("ATCG")).toBe("CGAT");
		expect(reverseComplement("AAAA")).toBe("TTTT");
		expect(reverseComplement("GGGG")).toBe("CCCC");
	});

	it("preserves N", () => {
		expect(reverseComplement("ANCG")).toBe("CGNT");
	});

	it("uppercases lowercase input", () => {
		expect(reverseComplement("atcg")).toBe("CGAT");
	});

	it("returns empty for empty input", () => {
		expect(reverseComplement("")).toBe("");
	});

	it("throws on invalid nucleotide", () => {
		expect(() => reverseComplement("ATBG")).toThrow(/Invalid nucleotide: B/);
	});

	it("is its own inverse", () => {
		const seq = "ATCGNATCGGCTAA";
		expect(reverseComplement(reverseComplement(seq))).toBe(seq);
	});
});

describe("translate", () => {
	it("translates a simple ORF", () => {
		expect(translate("ATGAAATAA")).toBe("MK*");
	});

	it("uppercases lowercase input", () => {
		expect(translate("atgaaa")).toBe("MK");
	});

	it("discards trailing partial codons", () => {
		expect(translate("ATGAA")).toBe("M");
		expect(translate("ATGA")).toBe("M");
	});

	it("returns X for unknown codons", () => {
		expect(translate("AAN")).toBe("X");
		expect(translate("ATGAANTAA")).toBe("MX*");
	});

	it("handles ambiguous N codons that are in the table", () => {
		expect(translate("CTN")).toBe("L");
		expect(translate("GGN")).toBe("G");
	});

	it("returns empty for empty input", () => {
		expect(translate("")).toBe("");
	});
});

describe("findOrfs", () => {
	it("returns empty for sequences of 300 bp or less", () => {
		expect(findOrfs("A".repeat(300))).toStrictEqual([]);
		expect(findOrfs("A".repeat(100))).toStrictEqual([]);
		expect(findOrfs("")).toStrictEqual([]);
	});

	it("returns empty when no frame has 100+ residues without a stop", () => {
		// 99 K's + stop on forward frame 0; reverse strand produces 'TTA' + 'TTT'*99 — also <100
		const seq = `${"AAA".repeat(99)}TAA`;
		expect(seq).toHaveLength(300);
		expect(findOrfs(seq)).toStrictEqual([]);
	});

	it("finds ORFs on both strands and frames 0 and 1", () => {
		const seq = "G".repeat(301);
		const orfs = findOrfs(seq);
		// Forward frames 0 and 1 both yield 100 G codons; reverse (all C) yields 100 P codons in frames 0 and 1.
		expect(orfs).toHaveLength(4);

		const forward = orfs.filter((o) => o.strand === 1);
		expect(forward.map((o) => o.frame).toSorted()).toStrictEqual([0, 1]);
		expect(forward.every((o) => o.pro === "G".repeat(100))).toBe(true);

		const reverse = orfs.filter((o) => o.strand === -1);
		expect(reverse.map((o) => o.frame).toSorted()).toStrictEqual([0, 1]);
		expect(reverse.every((o) => o.pro === "P".repeat(100))).toBe(true);
	});

	it("reports correct positions and nucleotide spans on the forward strand", () => {
		const seq = `ATG${"AAA".repeat(99)}TAAGG`;
		expect(seq).toHaveLength(305);

		const forward0 = findOrfs(seq).find((o) => o.strand === 1 && o.frame === 0);
		expect(forward0).toBeDefined();
		if (forward0 === undefined) {
			throw new Error("expected forward ORF");
		}
		expect(forward0.pro).toBe(`M${"K".repeat(99)}`);
		expect(forward0.pos).toStrictEqual([0, 303]);
		expect(forward0.nuc).toBe(`ATG${"AAA".repeat(99)}TAA`);
	});

	it("reports correct positions and nucleotide spans on the reverse strand", () => {
		// Forward: M + 99K + stop. Reverse complement frame 0 has no stop and 101 codons.
		const seq = `ATG${"AAA".repeat(99)}TAAGG`;

		const reverse0 = findOrfs(seq).find(
			(o) => o.strand === -1 && o.frame === 0,
		);
		expect(reverse0).toBeDefined();
		if (reverse0 === undefined) {
			throw new Error("expected reverse ORF");
		}
		expect(reverse0.pos[0]).toBeGreaterThanOrEqual(0);
		expect(reverse0.pos[1]).toBeLessThanOrEqual(seq.length);

		// The nuc on a reverse-strand ORF is the reverse-complement of the original slice.
		const slice = seq.slice(reverse0.pos[0], reverse0.pos[1]);
		expect(reverseComplement(slice)).toBe(reverse0.nuc);

		// And the protein matches translating that nuc.
		expect(translate(reverse0.nuc.slice(reverse0.frame))).toContain(
			reverse0.pro,
		);
	});

	it("produces non-negative positions for reverse-strand ORFs that run to the end", () => {
		// 301 bp of G means the reverse-complement is 301 bp of C: P*100 in frames 0 and 1, no stop.
		const orfs = findOrfs("G".repeat(301)).filter((o) => o.strand === -1);
		expect(orfs).toHaveLength(2);
		for (const orf of orfs) {
			expect(orf.pos[0]).toBeGreaterThanOrEqual(0);
			expect(orf.pos[1]).toBeLessThanOrEqual(301);
			expect(orf.nuc).toBe("C".repeat(300));
		}
	});
});

describe("parseFasta", () => {
	it("parses a single record", () => {
		expect(parseFasta(">a\nATCG\n")).toStrictEqual([["a", "ATCG"]]);
	});

	it("parses multiple records", () => {
		const content = ">a\nATCG\n>b\nGGGG\n";
		expect(parseFasta(content)).toStrictEqual([
			["a", "ATCG"],
			["b", "GGGG"],
		]);
	});

	it("joins multi-line sequences", () => {
		const content = ">a\nATCG\nAAAA\nTTTT\n";
		expect(parseFasta(content)).toStrictEqual([["a", "ATCGAAAATTTT"]]);
	});

	it("handles CRLF line endings", () => {
		expect(parseFasta(">a\r\nATCG\r\n")).toStrictEqual([["a", "ATCG"]]);
	});

	it("handles input without a trailing newline", () => {
		expect(parseFasta(">a\nATCG")).toStrictEqual([["a", "ATCG"]]);
	});

	it("returns empty for empty input", () => {
		expect(parseFasta("")).toStrictEqual([]);
	});

	it("throws when a sequence line precedes any header", () => {
		expect(() => parseFasta("ATCG\n>a\nGGGG\n")).toThrow(/Illegal FASTA line/);
	});

	it("preserves the rest of the header line including spaces", () => {
		expect(parseFasta(">id description here\nATCG\n")).toStrictEqual([
			["id description here", "ATCG"],
		]);
	});
});

describe("parseFastq", () => {
	async function collect(lines: string[]) {
		const out = [];
		for await (const record of parseFastq(lines)) {
			out.push(record);
		}
		return out;
	}

	it("parses a single record", async () => {
		const records = await collect(["@r1", "ATCG", "+", "!!!!"]);
		expect(records).toStrictEqual([
			{ header: "@r1", sequence: "ATCG", quality: "!!!!" },
		]);
	});

	it("parses multiple records", async () => {
		const records = await collect([
			"@r1",
			"ATCG",
			"+",
			"!!!!",
			"@r2",
			"GGGG",
			"+",
			"####",
		]);
		expect(records).toStrictEqual([
			{ header: "@r1", sequence: "ATCG", quality: "!!!!" },
			{ header: "@r2", sequence: "GGGG", quality: "####" },
		]);
	});

	it("strips trailing CR from lines", async () => {
		const records = await collect(["@r1\r", "ATCG\r", "+\r", "!!!!\r"]);
		expect(records).toStrictEqual([
			{ header: "@r1", sequence: "ATCG", quality: "!!!!" },
		]);
	});

	it("works with an async iterable", async () => {
		async function* source() {
			yield "@r1";
			yield "ATCG";
			yield "+";
			yield "!!!!";
		}
		const out = [];
		for await (const record of parseFastq(source())) out.push(record);
		expect(out).toStrictEqual([
			{ header: "@r1", sequence: "ATCG", quality: "!!!!" },
		]);
	});

	it("accepts a separator line with an identifier suffix", async () => {
		const records = await collect(["@r1", "ATCG", "+r1", "!!!!"]);
		expect(records).toStrictEqual([
			{ header: "@r1", sequence: "ATCG", quality: "!!!!" },
		]);
	});

	it("accepts a separator that repeats the header verbatim", async () => {
		const records = await collect(["@r1", "ATCG", "+@r1", "!!!!"]);
		expect(records).toStrictEqual([
			{ header: "@r1", sequence: "ATCG", quality: "!!!!" },
		]);
	});

	it("treats a quality line that begins with + as quality, not a separator", async () => {
		const records = await collect(["@r1", "ATCG", "+", "+!!!"]);
		expect(records).toStrictEqual([
			{ header: "@r1", sequence: "ATCG", quality: "+!!!" },
		]);
	});

	it("throws on a truncated record", async () => {
		await expect(collect(["@r1", "ATCG", "+"])).rejects.toThrow(
			/truncated record/,
		);
	});

	it("throws when the separator line does not start with +", async () => {
		await expect(collect(["@r1", "ATCG", "NOPE", "!!!!"])).rejects.toThrow(
			/expected separator/,
		);
	});
});
