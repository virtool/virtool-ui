import type {
	AnalysisMinimal,
	Blast,
	FormattedNuvsAnalysis,
} from "@analyses/types";
import { faker } from "@faker-js/faker";
import { createFakeIndexNested } from "./indexes";
import { createFakeServerJobNested } from "./jobs";
import { createFakeReferenceNested } from "./references";
import { createFakeSubtractionNested } from "./subtractions";
import { createFakeUserNested } from "./user";

/**
 * Create a fake analysis minimal object
 *
 * @param overrides - optional properties for creating an analysis minimal with specific values
 */
export function createFakeAnalysisMinimal(
	overrides?: Partial<AnalysisMinimal>,
): AnalysisMinimal {
	return {
		id: faker.number.int(),
		created_at: faker.date.past().toISOString(),
		index: createFakeIndexNested(),
		job: createFakeServerJobNested(),
		ready: true,
		reference: createFakeReferenceNested(),
		sample: {
			id: faker.number.int(),
		},
		subtractions: [createFakeSubtractionNested()],
		updated_at: faker.date.past().toISOString(),
		user: createFakeUserNested(),
		workflow: "pathoscope",
		...overrides,
	};
}

/**
 * Create a fake formatted nuvs analysis object
 *
 * @param overrides - optional properties for creating an fake formatted nuvs analysis with specific values
 */
export function createFakeFormattedNuVsAnalysis(
	overrides?: Partial<FormattedNuvsAnalysis>,
): FormattedNuvsAnalysis {
	const defaultAnalysis: FormattedNuvsAnalysis = {
		...createFakeAnalysisMinimal(),
		files: [],
		maxSequenceLength: faker.number.int({ min: 800, max: 20000 }),
		results: { hits: [createFakeFormattedNuVsHit()] },
		workflow: "nuvs",
	};

	return { ...defaultAnalysis, ...overrides };
}

type FakeFormattedNuVsHit = {
	blast?: Blast;
	index?: number;
};

/**
 * Create a fake nuvs hit object
 *
 * @param overrides - optional properties for creating an nuvs hit with specific values
 */
export function createFakeFormattedNuVsHit(overrides?: FakeFormattedNuVsHit) {
	const nuvsHit = {
		annotatedOrfCount: faker.number.int(),
		blast: null,
		e: faker.number.float({ min: 1e-23, max: 0.001 }),
		families: [],
		id: faker.number.int(),
		index: faker.number.int(),
		name: [faker.word.noun({ strategy: "any-length" })],
		orfs: [
			{
				frame: faker.number.int(),
				hits: [
					{
						best_bias: faker.number.float(),
						best_e: faker.number.float(),
						best_score: faker.number.float(),
						cluster: faker.number.int(),
						families: {},
						full_bias: faker.number.float(),
						full_e: faker.number.float(),
						full_score: faker.number.float(),
						hit: faker.number.int({ min: 1 }),
						names: [faker.word.noun({ strategy: "any-length" })],
					},
				],
				index: faker.number.int(),
				pos: [faker.number.int(), faker.number.int()],
				pro: faker.word.noun({ strategy: "any-length" }),
				strand: faker.number.int({ min: 1, max: 2 }),
			},
		],
		sequence: faker.string.fromCharacters("ATGC", { min: 20, max: 150 }),
	};

	return { ...nuvsHit, ...overrides };
}
