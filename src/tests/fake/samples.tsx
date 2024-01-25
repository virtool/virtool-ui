import { faker } from "@faker-js/faker";
import { assign } from "lodash";
import nock from "nock";
import { LabelNested } from "../../js/labels/types";
import { LibraryType, Sample, SampleMinimal, WorkflowState } from "../../js/samples/types";
import { SubtractionNested } from "../../js/subtraction/types";
import { createFakeLabelNested } from "./labels";
import { createFakeSubtractionNested } from "./subtractions";
import { createFakeUserNested } from "./user";

export type CreateFakeSampleMinimal = {
    name?: string;
    labels?: LabelNested[] | number[];
    host?: string;
    isolate?: string;
    library_type?: LibraryType;
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

type CreateFakeSample = CreateFakeSampleMinimal & {
    group?: number | string | null;
    paired?: boolean;
    locale?: string;
    subtractions?: Array<SubtractionNested>;
};

/**
 * Create a fake sample object
 */
export function createFakeSample(overrides?: CreateFakeSample): Sample {
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
        locale: faker.random.word(),
        paired: faker.datatype.boolean(),
        quality: null,
        reads: [],
        subtractions: [createFakeSubtractionNested()],
    };

    return assign(defaultSample, overrides);
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

/**
 * Sets up a mocked API route for updating the sample details
 *
 * @param sample - The sample details
 * @param name - The updated name
 * @param isolate - The updated isolate
 * @param host - The updated host
 * @param locale - The updated locale
 * @param notes - The updated notes
 * @returns A nock scope for the mocked API call
 */
export function mockApiEditSample(
    sample: Sample,
    name: string,
    isolate: string,
    host: string,
    locale: string,
    notes: string,
) {
    const sampleDetail = { ...sample, name, isolate, host, locale, notes };

    return nock("http://localhost").patch(`/api/samples/${sample.id}`).reply(200, sampleDetail);
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
 * @param name - The name of the sample
 * @param isolate - The sample isolate
 * @param host - The sample host
 * @param locale - The locale of the sample
 * @param library_type - The library type of the sample
 * @param files - The sample files used to create the sample
 * @param labels - The labels associated with the sample
 * @param subtractions - The subtractions associated with the sample
 * @param group - The group associated with the sample
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateSample(
    name: string,
    isolate: string,
    host: string,
    locale: string,
    library_type: LibraryType,
    files: string[],
    labels: number[],
    subtractions: string[],
    group: string | null,
) {
    const sample = createFakeSample({
        name,
        isolate,
        host,
        locale,
        library_type,
        labels,
        subtractions: [createFakeSubtractionNested({ id: subtractions[0] })],
        group,
    });

    return nock("http://localhost")
        .post("/api/samples", { name, isolate, host, locale, library_type, files, labels, subtractions, group })
        .reply(201, sample);
}
