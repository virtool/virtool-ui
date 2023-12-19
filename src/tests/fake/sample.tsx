import { faker } from "@faker-js/faker";
import { assign, pick } from "lodash";
import nock from "nock";
import { LabelNested } from "../../js/labels/types";
import { LibraryType, SampleMinimal, WorkflowState } from "../../js/samples/types";
import { createFakeLabelNested } from "./labels";
import { createFakeUserNested } from "./user";

type CreateFakeSampleMinimal = {
    labels?: LabelNested[] | number[];
};

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

type CreateFakeSample = CreateFakeSampleMinimal & {
    files?: any;
    subtractions?: any;
};

export function createFakeSample(overrides?: CreateFakeSample) {
    const { files, ...props } = overrides || {};
    const sampleMinimal = pick(createFakeSampleMinimal(props), ["name", "isolate", "host", "library_type"]);
    const defaultCreateSample = {
        ...sampleMinimal,
        locale: faker.random.word(),
        subtractions: faker.datatype.number(),
        files: files || [faker.datatype.number(), faker.datatype.number()],
        labels: [],
        group: null,
    };

    return assign(defaultCreateSample, overrides);
}

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

/**
 * Creates a mocked API call for creating a sample
 *
 * @returns {nock.Scope} nock scope for the mocked API call
 */
export function mockApiCreateSample(createSample) {
    return nock("http://localhost").post("/api/samples", createSample).reply(201, createSample);
}
