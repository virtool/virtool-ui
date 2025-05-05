import { faker } from "@faker-js/faker";
import { assign, merge } from "lodash";
import nock from "nock";
import {
    AnalysisMinimal,
    AnalysisSample,
    Blast,
    FormattedNuvsResults,
    Workflows,
} from "../../analyses/types";
import { JobMinimal } from "../../jobs/types";
import { createFakeIndexNested } from "./indexes";
import { createFakeJobMinimal } from "./jobs";
import { createFakeReferenceNested } from "./references";
import { createFakeSubtractionNested } from "./subtractions";
import { createFakeUserNested } from "./user";

export type CreateFakeAnalysisMinimal = {
    job?: JobMinimal;
    sample?: AnalysisSample;
    workflow?: string;
};

/**
 * Create a fake analysis minimal object
 *
 * @param overrides - optional properties for creating an analysis minimal with specific values
 */
export function createFakeAnalysisMinimal(
    overrides?: CreateFakeAnalysisMinimal,
): AnalysisMinimal {
    const defaultAnalysisMinimal = {
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        created_at: faker.date.past().toISOString(),
        index: createFakeIndexNested(),
        job: createFakeJobMinimal(),
        ready: true,
        reference: createFakeReferenceNested(),
        sample: {
            id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        },
        subtractions: [createFakeSubtractionNested()],
        updated_at: faker.date.past().toISOString(),
        user: createFakeUserNested(),
        workflow: "pathoscope_bowtie",
    };

    return assign(defaultAnalysisMinimal, overrides);
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
        workflow: Workflows.nuvs,
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
        name: [faker.word.noun()],
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
                        hit: faker.word.noun(),
                        names: [faker.word.noun()],
                    },
                ],
                index: faker.number.int(),
                pos: [faker.number.int(), faker.number.int()],
                pro: faker.word.noun(),
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
        .post(`/api/samples/${sampleId}/analyses`, requestBody)
        .reply(201);
}

/**
 * Creates a mocked API call for initiating a blast for a NuVs sequence
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
