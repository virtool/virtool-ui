import { faker } from "@faker-js/faker";
import { assign } from "lodash";
import nock from "nock";
import { LabelNested } from "../../js/labels/types";
import { LibraryType, SampleMinimal, WorkflowState } from "../../js/samples/types";
import { createFakeLabelNested } from "./labels";
import { createFakeUserNested } from "./user";

export type CreateFakeSampleMinimal = {
    labels?: LabelNested[] | number[];
    host?: string;
    isolate?: string;
};

/**
 * Create a fake sample minimal object
 *
 * @param overrides - optional properties for creating a sample minimal with specific values
 */
export function createFakeSampleMinimal(overrides?: CreateFakeSampleMinimal): SampleMinimal {
    const defaultSampleMinimal = {
        id: faker.random.alphaNumeric(8),
        name: faker.random.word(),
        created_at: faker.date.past().toISOString(),
        host: faker.random.word(),
        isolate: faker.random.word(),
        labels: [createFakeLabelNested()],
        library_type: LibraryType.normal,
        notes: faker.random.word(),
        nuvs: faker.datatype.boolean(),
        pathoscope: faker.datatype.boolean(),
        ready: true,
        user: createFakeUserNested(),
        workflows: { aodp: WorkflowState.INCOMPATIBLE, nuvs: WorkflowState.NONE, pathoscope: WorkflowState.NONE },
    };

    return assign(defaultSampleMinimal, overrides);
}

/**
 * Creates a mocked API call for getting a paginated list of samples
 *
 * @param samples - The sample documents
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSamples(samples: SampleMinimal[]) {
    return nock("http://localhost").get("/api/samples").query(true).reply(200, {
        page: 1,
        page_count: 1,
        per_page: 5,
        total_count: samples.length,
        found_count: samples.length,
        documents: samples,
    });
}

export type CreateSampleType = {
    name: string;
    isolate: string;
    host: string;
    locale: string;
    library_type: string;
    files: string[];
    labels: number[];
    subtractions: string[];
    group: string | null;
};

/**
 * Creates a mocked API call for creating a sample
 *
 * @param createSample - The data needed to create a sample
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateSample(createSample: CreateSampleType) {
    return nock("http://localhost").post("/api/samples", createSample).reply(201, createSample);
}
