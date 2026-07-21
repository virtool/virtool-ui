import { faker } from "@faker-js/faker";
import type {
	Reference,
	ReferenceMinimal,
	ReferenceNested,
} from "@references/types";
import { createFakeUserNested } from "./user";

/**
 * Create a fake reference nested
 */
export function createFakeReferenceNested(
	overrides?: Partial<ReferenceNested>,
): ReferenceNested {
	return {
		id: faker.number.int(),
		data_type: "genome",
		name: faker.word.noun({ strategy: "any-length" }),
		...overrides,
	};
}

/**
 * Create a fake reference minimal
 */
export function createFakeReferenceMinimal(
	overrides?: Partial<ReferenceMinimal>,
): ReferenceMinimal {
	const defaultReferenceMinimal = {
		...createFakeReferenceNested(overrides),
		archived: false,
		cloned_from: {
			id: faker.number.int(),
			name: faker.word.noun({ strategy: "any-length" }),
		},
		created_at: faker.date.past().toISOString(),
		imported_from: null,
		installed: null,
		internal_control: faker.word.noun({ strategy: "any-length" }),
		latest_build: null,
		organism: faker.word.noun({ strategy: "any-length" }),
		otu_count: faker.number.int(),
		release: null,
		remotes_from: null,
		task: {
			complete: true,
			created_at: faker.date.past(),
			error: null,
			id: faker.number.int(),
			progress: 100,
			step: "done",
			type: "clone_reference",
		},
		unbuilt_change_count: faker.number.int(),
		updating: false,
		user: createFakeUserNested(),
	};

	return { ...defaultReferenceMinimal, ...overrides };
}

/**
 * Create a fake reference
 */
export function createFakeReference(overrides?: Partial<Reference>): Reference {
	const { description, ...props } = overrides || {};

	const defaultReference = {
		...createFakeReferenceMinimal(props),
		contributors: [],
		description: description || "",
		groups: [],
		restrict_source_types: false,
		source_types: ["isolate", "strain"],
		users: [
			{
				...createFakeUserNested(),
				build: true,
				created_at: faker.date.past().toISOString(),
				modify: true,
				modify_otu: true,
				remove: true,
			},
		],
	};

	return { ...defaultReference, ...props };
}
