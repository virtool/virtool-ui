import { faker } from "@faker-js/faker";
import type { IndexFile, IndexMinimal, IndexNested } from "@indexes/types";
import { createFakeServerJobNested } from "./jobs";
import { createFakeReferenceNested } from "./references";
import { createFakeUserNested } from "./user";

export function createFakeIndexNested(
	overrides?: Partial<IndexNested>,
): IndexNested {
	const defaultIndexNested = {
		id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
		version: faker.number.int({ max: 10 }),
	};

	return { ...defaultIndexNested, ...overrides };
}

export function createFakeIndexMinimal(
	overrides?: Partial<IndexMinimal>,
): IndexMinimal {
	const defaultIndexMinimal = {
		...createFakeIndexNested(),
		change_count: faker.number.int({ min: 2, max: 10 }),
		created_at: faker.date.past().toISOString(),
		has_files: faker.datatype.boolean(),
		job: createFakeServerJobNested({ workflow: "build_index" }),
		modified_otu_count: faker.number.int({ min: 2, max: 10 }),
		reference: createFakeReferenceNested(),
		user: createFakeUserNested(),
		ready: faker.datatype.boolean(),
	};

	return { ...defaultIndexMinimal, ...overrides };
}

export function createFakeIndexFile(overrides?: Partial<IndexFile>): IndexFile {
	const defaultIndexFile = {
		download_url: `/testUrl/${faker.word.noun({ strategy: "any-length" })}`,
		id: faker.number.int(),
		index: faker.string.alphanumeric({ casing: "lower", length: 8 }),
		name: faker.word.noun({ strategy: "any-length" }),
		size: faker.number.int({ min: 20000 }),
		type: "fasta",
	};

	return { ...defaultIndexFile, ...overrides };
}
