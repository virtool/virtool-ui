import { createFakeFile } from "@tests/fake/files";
import { describe, expect, it } from "vitest";
import {
	buildReadRows,
	detectMate,
	getReadRowKey,
	getReadRowReads,
	getReadsForUpload,
} from "./pairing";

describe("detectMate", () => {
	it.each([
		["sample_R1_001.fastq.gz", "sample_R2_001.fastq.gz"],
		["sample_1.fastq.gz", "sample_2.fastq.gz"],
		["sample.1.fastq.gz", "sample.2.fastq.gz"],
	])("matches %s and %s to the same stem", (r1, r2) => {
		const a = detectMate(r1);
		const b = detectMate(r2);

		expect(a?.side).toBe(1);
		expect(b?.side).toBe(2);
		expect(a?.stem).toBe(b?.stem);
	});

	it("returns null when no mate token is present", () => {
		expect(detectMate("sample.fastq.gz")).toBeNull();
		expect(detectMate("R1.fastq.gz")).toBeNull();
	});
});

describe("buildReadRows", () => {
	it("collapses a detected pair into one pair row with R1 left, R2 right", () => {
		const r1 = createFakeFile({ name: "sample_R1_001.fastq.gz" });
		const r2 = createFakeFile({ name: "sample_R2_001.fastq.gz" });

		const rows = buildReadRows([r1, r2]);

		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({
			kind: "pair",
			left: { id: r1.id },
			right: { id: r2.id },
		});
	});

	it("orders R1 left and R2 right regardless of input order", () => {
		const r1 = createFakeFile({ name: "sample_R1.fastq.gz" });
		const r2 = createFakeFile({ name: "sample_R2.fastq.gz" });

		const rows = buildReadRows([r2, r1]);

		expect(rows[0]).toMatchObject({
			kind: "pair",
			left: { id: r1.id },
			right: { id: r2.id },
		});
	});

	it("renders a lone mate as a single row", () => {
		const r1 = createFakeFile({ name: "sample_R1.fastq.gz" });

		const rows = buildReadRows([r1]);

		expect(rows).toEqual([{ kind: "single", file: r1 }]);
	});

	it("does not pair three or more files sharing a stem", () => {
		const files = [
			createFakeFile({ name: "sample_R1.fastq.gz" }),
			createFakeFile({ name: "sample_R2.fastq.gz" }),
			createFakeFile({ name: "sample_R1.fastq.gz" }),
		];

		const rows = buildReadRows(files);

		expect(rows).toHaveLength(3);
		expect(rows.every((row) => row.kind === "single")).toBe(true);
	});

	it("does not pair files with differing extensions", () => {
		const files = [
			createFakeFile({ name: "sample_R1.fastq.gz" }),
			createFakeFile({ name: "sample_R2.fastq" }),
		];

		const rows = buildReadRows(files);

		expect(rows).toHaveLength(2);
		expect(rows.every((row) => row.kind === "single")).toBe(true);
	});

	it("preserves list order, placing a pair at its first member's position", () => {
		const single = createFakeFile({ name: "other.fastq.gz" });
		const r1 = createFakeFile({ name: "sample_R1.fastq.gz" });
		const r2 = createFakeFile({ name: "sample_R2.fastq.gz" });

		const rows = buildReadRows([single, r1, r2]);

		expect(rows).toHaveLength(2);
		expect(rows[0]).toMatchObject({ kind: "single", file: { id: single.id } });
		expect(rows[1]).toMatchObject({ kind: "pair", left: { id: r1.id } });
	});
});

describe("getReadRowReads", () => {
	it("returns a pair's mates in [LEFT, RIGHT] order", () => {
		const r1 = createFakeFile({ name: "sample_R1.fastq.gz" });
		const r2 = createFakeFile({ name: "sample_R2.fastq.gz" });

		// Given in R2, R1 order to prove the reads come back ordered by side.
		const [row] = buildReadRows([r2, r1]);

		expect(row && getReadRowReads(row)).toEqual([r1, r2]);
	});

	it("returns a single row's lone file", () => {
		const file = createFakeFile({ name: "sample.fastq.gz" });
		const [row] = buildReadRows([file]);

		expect(row && getReadRowReads(row)).toEqual([file]);
	});
});

describe("getReadRowKey", () => {
	it("gives each row of a list a distinct key", () => {
		const rows = buildReadRows([
			createFakeFile({ name: "sample_R1.fastq.gz" }),
			createFakeFile({ name: "sample_R2.fastq.gz" }),
			createFakeFile({ name: "other.fastq.gz" }),
			createFakeFile({ name: "another.fastq.gz" }),
		]);

		const keys = rows.map(getReadRowKey);

		expect(keys).toHaveLength(3);
		expect(new Set(keys).size).toBe(3);
	});
});

describe("getReadsForUpload", () => {
	it("includes the mate of a paired file, in [LEFT, RIGHT] order", () => {
		const r1 = createFakeFile({ name: "sample_R1.fastq.gz" });
		const r2 = createFakeFile({ name: "sample_R2.fastq.gz" });

		expect(getReadsForUpload(r2, [r1, r2])).toEqual([r1, r2]);
	});

	it("returns an unpaired file alone", () => {
		const file = createFakeFile({ name: "sample.fastq.gz" });
		const other = createFakeFile({ name: "other.fastq.gz" });

		expect(getReadsForUpload(file, [file, other])).toEqual([file]);
	});

	it("returns the file alone when its mate isn't listed alongside it", () => {
		const r1 = createFakeFile({ name: "sample_R1.fastq.gz" });

		expect(getReadsForUpload(r1, [r1])).toEqual([r1]);
	});
});
