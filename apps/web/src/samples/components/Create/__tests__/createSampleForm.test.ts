import { createFakeFile } from "@tests/fake/files";
import { describe, expect, it } from "vitest";
import {
	getCreateSampleFormValues,
	getSampleDrafts,
} from "../createSampleForm";

describe("getSampleDrafts", () => {
	it("makes one paired draft from both mates of a pair", () => {
		const r1 = createFakeFile({ name: "sample_one_R1.fastq.gz" });
		const r2 = createFakeFile({ name: "sample_one_R2.fastq.gz" });

		const drafts = getSampleDrafts([r1, r2]);

		expect(drafts).toHaveLength(1);
		expect(drafts[0]?.reads).toEqual([r1, r2]);
	});

	it("makes one draft per unpaired file", () => {
		const first = createFakeFile({ name: "one.fastq.gz" });
		const second = createFakeFile({ name: "two.fastq.gz" });

		const drafts = getSampleDrafts([first, second]);

		expect(drafts).toHaveLength(2);
		expect(drafts.map((draft) => draft.reads)).toEqual([[first], [second]]);
	});

	it("makes an unpaired draft from a mate whose partner wasn't selected", () => {
		const r1 = createFakeFile({ name: "sample_one_R1.fastq.gz" });

		const drafts = getSampleDrafts([r1]);

		expect(drafts).toHaveLength(1);
		expect(drafts[0]?.reads).toEqual([r1]);
	});

	it("gives each draft a distinct key", () => {
		const drafts = getSampleDrafts([
			createFakeFile({ name: "sample_one_R1.fastq.gz" }),
			createFakeFile({ name: "sample_one_R2.fastq.gz" }),
			createFakeFile({ name: "two.fastq.gz" }),
		]);

		expect(new Set(drafts.map((draft) => draft.key)).size).toBe(2);
	});
});

describe("getCreateSampleFormValues", () => {
	it("names each sample after the read files it will be created from", () => {
		const r1 = createFakeFile({ name: "sample_one_R1.fastq.gz" });
		const r2 = createFakeFile({ name: "sample_one_R2.fastq.gz" });
		const single = createFakeFile({ name: "sample_two.fastq.gz" });

		const values = getCreateSampleFormValues(getSampleDrafts([r1, r2, single]));

		expect(values.samples.map((sample) => sample.name)).toEqual([
			"sample_one",
			"sample_two",
		]);
	});

	it("starts every sample with no labels and no subtractions", () => {
		const values = getCreateSampleFormValues(
			getSampleDrafts([createFakeFile({ name: "one.fastq.gz" })]),
		);

		expect(values.samples[0]).toMatchObject({
			labels: [],
			subtractionIds: [],
		});
	});

	it("shares one library type and group across the batch", () => {
		const values = getCreateSampleFormValues(
			getSampleDrafts([createFakeFile({ name: "one.fastq.gz" })]),
		);

		expect(values.group).toBe("");
		expect(values.libraryType).toBe("normal");
	});
});
