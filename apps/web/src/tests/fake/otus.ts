import { faker } from "@faker-js/faker";
import type {
	HistoryNested,
	Otu,
	OtuIsolate,
	OtuMinimal,
	OtuSegment,
	OtuSequence,
} from "@otus/types";
import { createFakeReferenceNested } from "./references";
import { createFakeUserNested } from "./user";

/**
 * Create a fake history nested
 */
export function createFakeHistoryNested(): HistoryNested {
	return {
		created_at: faker.date.past().toISOString(),
		description: faker.lorem.lines(1),
		id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
		method_name: "create",
		user: createFakeUserNested(),
	};
}

/**
 * Create a fake OTU sequence
 */
export function createFakeOtuSequence(
	overrides?: Partial<OtuSequence>,
): OtuSequence {
	const sequence = {
		accession: faker.word.noun({ strategy: "any-length" }),
		definition: faker.word.noun({ strategy: "any-length" }),
		host: faker.word.noun({ strategy: "any-length" }),
		id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
		segment: null,
		sequence: faker.word.noun({ strategy: "any-length" }),
	};

	return { ...sequence, ...overrides };
}

/**
 * Create a fake OTU isolate
 */
export function createFakeOtuIsolate(): OtuIsolate {
	return {
		default: false,
		id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
		sequences: [createFakeOtuSequence()],
		source_name: faker.word.noun({ strategy: "any-length" }),
		source_type: faker.word.noun({ strategy: "any-length" }),
	};
}

/**
 * Create a fake OTU segment
 */
export function createFakeOtuSegment(): OtuSegment {
	return {
		molecule: null,
		name: faker.word.noun({ strategy: "any-length" }),
		required: false,
	};
}

/**
 * Create a fake minimal OTU
 */
export function createFakeOtuMinimal(
	overrides?: Partial<OtuMinimal>,
): OtuMinimal {
	const defaultOtuMinimal = {
		abbreviation: `${faker.string.fromCharacters("AHJKYUIQWE", { min: 2, max: 4 })}V`,
		id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
		name: faker.word.noun({ strategy: "any-length" }),
		reference: createFakeReferenceNested(),
		verified: true,
		version: faker.number.int({ max: 10 }),
	};

	return { ...defaultOtuMinimal, ...overrides };
}

/**
 * Create a fake OTU object.
 */
export function createFakeOtu(overrides?: Partial<Otu>): Otu {
	const { isolates, issues, remote, ...props } = overrides || {};
	return {
		...createFakeOtuMinimal(props),
		isolates: isolates || [createFakeOtuIsolate()],
		issues: issues || null,
		last_indexed_version: null,
		most_recent_change: createFakeHistoryNested(),
		schema: Array.from({ length: 2 }, createFakeOtuSegment),
		remote,
	};
}
