import {
    Analysis,
    AnalysisMinimal,
    Blast,
    FormattedNuvsResults,
    IimiAnalysis,
    IimiCoverage,
    IimiHit,
    IimiIsolate,
    IimiSequence,
    UntrustworthyRange,
} from "@analyses/types";
import { faker } from "@faker-js/faker";
import { merge } from "lodash-es";
import nock from "nock";
import { createFakeIndexNested } from "./indexes";
import { createFakeServerJobMinimal } from "./jobs";
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
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        created_at: faker.date.past().toISOString(),
        index: createFakeIndexNested(),
        job: createFakeServerJobMinimal(),
        ready: true,
        reference: createFakeReferenceNested(),
        sample: {
            id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        },
        subtractions: [createFakeSubtractionNested()],
        updated_at: faker.date.past().toISOString(),
        user: createFakeUserNested(),
        workflow: "pathoscope_bowtie",
        ...overrides,
    };
}

type FakeFormattedNuVsAnalysis = FakeFormattedNuVsHit & {
    results?: FormattedNuvsResults;
};

/**
 * Create a fake formatted nuvs analysis object
 *
 * @param overrides - optional properties for creating an fake formatted nuvs analysis with specific values
 */
export function createFakeFormattedNuVsAnalysis(
    overrides?: FakeFormattedNuVsAnalysis,
) {
    const defaultAnalysis = {
        ...createFakeAnalysisMinimal(),
        files: [],
        maxSequenceLength: faker.number.int({ min: 800, max: 20000 }),
        results: { hits: [createFakeFormattedNuVsHit()] },
        workflow: "nuvs",
    };

    return merge(defaultAnalysis, overrides);
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
                        hit: faker.word.noun({ strategy: "any-length" }),
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

    return merge(nuvsHit, overrides);
}

/**
 * Creates a mocked API call for getting a paginated list of analyses
 *
 * @param analyses - The analysis documents
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetAnalyses(analyses: AnalysisMinimal[]) {
    return nock("http://localhost")
        .get(`/api/samples/${analyses[0].sample.id}/analyses`)
        .query(true)
        .reply(200, {
            page: 1,
            page_count: 1,
            per_page: 25,
            total_count: analyses.length,
            found_count: analyses.length,
            documents: analyses,
        });
}

type CreateAnalysisRequestBody = {
    ml?: string;
    ref_id: string;
    subtractions?: string[];
    workflow: string;
};

/**
 * Creates a mocked API call for getting an analysis
 *
 * @param sampleId - The unique identifier of the sample being analysed
 * @param requestBody - The request body for creating an analysis
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateAnalysis(
    sampleId: string,
    requestBody: CreateAnalysisRequestBody,
) {
    return nock("http://localhost")
        .post(
            `/api/samples/${sampleId}/anal
        yses`,
            requestBody,
        )
        .reply(201);
}

/**
 * Creates a mocked API call for getting a single analysis
 *
 * @param analysis - The analysis document
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetAnalysis(analysis: Analysis) {
    return nock("http://localhost")
        .get(`/api/analyses/${analysis.id}`)
        .reply(200, analysis);
}

/**
 * Creates a mocked API call for initiating a blast for a Nuvs sequence
 *
 * @param analysisId - The id of the analysis associated with the sequence
 * @param sequenceIndex - The index of the sequence the blast is initiating for
 * @returns The nock scope for the mocked API call
 */
export function mockApiBlastNuVs(analysisId: string, sequenceIndex: string) {
    return nock("http://localhost")
        .put(`/api/analyses/${analysisId}/${sequenceIndex}/blast`)
        .reply(200);
}

/**
 * Create a fake iimi analysis object
 */
export function createFakeIimiAnalysis(): IimiAnalysis {
    return {
        ...createFakeAnalysisMinimal(),
        files: [],
        results: {
            hits: [createFakeIimiHit()],
        },
        workflow: "iimi",
    };
}

/**
 * Create a fake iimi hit object
 */
export function createFakeIimiHit(): IimiHit {
    return {
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        abbreviation: faker.string.alpha({ casing: "upper", length: 3 }),
        isolates: [createFakeIimiIsolate()],
        name: faker.word.noun({ strategy: "any-length" }),
        result: faker.datatype.boolean(),
    };
}

/**
 * Create a fake iimi isolate object
 */
export function createFakeIimiIsolate(): IimiIsolate {
    return {
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        sequences: [createFakeIimiSequence()],
        source_name: faker.word.noun({ strategy: "any-length" }),
        source_type: faker.helpers.arrayElement([
            "isolate",
            "strain",
            "genotype",
        ]),
    };
}

/**
 * Create a fake iimi sequence object
 */
export function createFakeIimiSequence(): IimiSequence {
    const length = faker.number.int({ min: 1000, max: 50000 });
    return {
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        coverage: createFakeIimiCoverage(),
        length,
        probability: faker.number.float({ min: 0.5, max: 1 }),
        result: faker.datatype.boolean(),
        untrustworthy_ranges: Array.from(
            { length: faker.number.int({ min: 0, max: 3 }) },
            () =>
                [
                    faker.number.int({ min: 0, max: length - 100 }),
                    faker.number.int({ min: 100, max: length }),
                ] as UntrustworthyRange,
        ),
    };
}

/**
 * Create a fake iimi coverage object
 */
export function createFakeIimiCoverage(): IimiCoverage {
    const segmentCount = faker.number.int({ min: 10, max: 100 });
    return {
        lengths: Array.from({ length: segmentCount }, () =>
            faker.number.int({ min: 10, max: 1000 }),
        ),
        values: Array.from({ length: segmentCount }, () =>
            faker.number.int({ min: 0, max: 500 }),
        ),
    };
}
