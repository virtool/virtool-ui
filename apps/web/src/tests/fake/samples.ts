import { faker } from "@faker-js/faker";
import type { Quality, Read, Sample, SampleMinimal } from "@samples/types";
import { createFakeServerJobNested } from "./jobs";
import { createFakeLabelNested } from "./labels";
import { createFakeSubtractionNested } from "./subtractions";
import { createFakeUserNested } from "./user";

/**
 * Create a fake sample minimal object
 *
 * @param overrides - optional properties for creating a sample minimal with specific values
 */
export function createFakeSampleMinimal(
	overrides?: Partial<SampleMinimal>,
): SampleMinimal {
	const defaultSampleMinimal: SampleMinimal = {
		id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
		name: `${faker.word.noun({ strategy: "any-length" })} ${faker.number.int()}`,
		created_at: faker.date.past().toISOString(),
		host: faker.word.noun({ strategy: "any-length" }),
		isolate: faker.word.noun({ strategy: "any-length" }),
		job: createFakeServerJobNested({ workflow: "create_sample" }),
		labels: [createFakeLabelNested()],
		library_type: "normal",
		notes: faker.lorem.lines(5),
		nuvs: faker.datatype.boolean(),
		pathoscope: faker.datatype.boolean(),
		ready: true,
		user: createFakeUserNested(),
		workflows: {
			nuvs: "none",
			pathoscope: "none",
		},
	};

	return { ...defaultSampleMinimal, ...overrides };
}

/**
 * Create a fake sample read object
 */
export function createFakeSampleRead(overrides?: Partial<Read>): Read {
	const defaultRead = {
		download_url: faker.word.noun({ strategy: "any-length" }),
		id: faker.number.int(),
		name: faker.word.noun({ strategy: "any-length" }),
		name_on_disk: faker.word.noun({ strategy: "any-length" }),
		sample: faker.word.noun({ strategy: "any-length" }),
		size: faker.number.int(),
		uploaded_at: faker.date.past().toISOString(),
	};

	return { ...defaultRead, ...overrides };
}

export function createFakeSampleQuality(): Quality {
	return {
		bases: [Array.from({ length: 6 }, () => faker.number.int())],
		composition: [Array.from({ length: 4 }, () => faker.number.int())],
		count: faker.number.int(),
		encoding: "Sanger / Illumina 1.9",
		gc: faker.number.int(),
		length: [faker.number.int(), faker.number.int()],
		sequences: Array.from({ length: 10 }, () => faker.number.int()),
	};
}

/**
 * Create a fake sample object
 */
export function createFakeSample(overrides?: Partial<Sample>): Sample {
	const defaultSample = {
		...createFakeSampleMinimal(),
		all_read: faker.datatype.boolean(),
		all_write: faker.datatype.boolean(),
		artifacts: [],
		format: "fastq",
		group: null,
		group_read: faker.datatype.boolean(),
		group_write: faker.datatype.boolean(),
		hold: faker.datatype.boolean(),
		is_legacy: faker.datatype.boolean(),
		locale: faker.location.country(),
		paired: faker.datatype.boolean(),
		quality: createFakeSampleQuality(),
		reads: [createFakeSampleRead()],
		subtractions: [createFakeSubtractionNested()],
	};

	return { ...defaultSample, ...overrides };
}
