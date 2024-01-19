import { faker } from "@faker-js/faker";
import { assign } from "lodash";
import nock from "nock";
import { AnalysisMinimal, AnalysisSample } from "../../js/analyses/types";
import { JobMinimal } from "../../js/jobs/types";
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
export function createFakeAnalysisMinimal(overrides?: CreateFakeAnalysisMinimal): AnalysisMinimal {
    const defaultAnalysisMinimal = {
        id: faker.random.alphaNumeric(8),
        created_at: faker.date.past().toISOString(),
        index: createFakeIndexNested(),
        job: createFakeJobMinimal(),
        ready: true,
        reference: createFakeReferenceNested(),
        sample: { id: faker.random.alphaNumeric(8) },
        subtractions: [createFakeSubtractionNested()],
        updated_at: faker.date.past().toISOString(),
        user: createFakeUserNested(),
        workflow: "pathoscope_bowtie",
    };

    return assign(defaultAnalysisMinimal, overrides);
}

/**
 * Creates a mocked API call for getting a paginated list of analyses
 *
 * @param analyses - The analysis documents
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetAnalyses(analyses: AnalysisMinimal[]) {
    return nock("http://localhost").get(`/api/samples/${analyses[0].sample.id}/analyses`).query(true).reply(200, {
        page: 1,
        page_count: 1,
        per_page: 25,
        total_count: analyses.length,
        found_count: analyses.length,
        documents: analyses,
    });
}
