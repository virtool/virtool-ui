import { faker } from "@faker-js/faker";
import { SampleRightsUpdate } from "@samples/api";
import {
    LibraryType,
    Quality,
    Read,
    Sample,
    SampleMinimal,
    WorkflowState,
} from "@samples/types";
import { assign } from "lodash-es";
import nock from "nock";
import { createFakeServerJobMinimal } from "./jobs";
import { createFakeLabelNested } from "./labels";
import { createFakeSubtractionNested } from "./subtractions";
import { createFakeUserNested } from "./user";

/**
 * Create a fake sample minimal object
 *
 * @param overrides - optional properties for creating a sample minimal with specific values
 */
export function createFakeSampleMinimal(
    overrides?: Partial<SampleMinimal>,
): SampleMinimal {
    const defaultSampleMinimal = {
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        name: `${faker.word.noun({ strategy: "any-length" })} ${faker.number.int()}`,
        created_at: faker.date.past().toISOString(),
        host: faker.word.noun({ strategy: "any-length" }),
        isolate: faker.word.noun({ strategy: "any-length" }),
        job: createFakeServerJobMinimal({ workflow: "create_sample" }),
        labels: [createFakeLabelNested()],
        library_type: LibraryType.normal,
        notes: faker.lorem.lines(5),
        nuvs: faker.datatype.boolean(),
        pathoscope: faker.datatype.boolean(),
        ready: true,
        user: createFakeUserNested(),
        workflows: {
            nuvs: WorkflowState.NONE,
            pathoscope: WorkflowState.NONE,
        },
    };

    return assign(defaultSampleMinimal, overrides);
}

/**
 * Create a fake sample read object
 */
export function createFakeSampleRead(overrides?: Partial<Read>): Read {
    const defaultRead = {
        download_url: faker.word.noun({ strategy: "any-length" }),
        id: faker.number.int(),
        name: faker.word.noun({ strategy: "any-length" }),
        name_on_disk: faker.word.noun({ strategy: "any-length" }),
        sample: faker.word.noun({ strategy: "any-length" }),
        size: faker.number.int(),
        upload: null,
        uploaded_at: faker.date.past().toISOString(),
    };

    return assign(defaultRead, overrides);
}

export function createFakeSampleQuality(): Quality {
    return {
        bases: [Array.from({ length: 6 }, () => faker.number.int())],
        composition: [Array.from({ length: 4 }, () => faker.number.int())],
        count: faker.number.int(),
        encoding: "Sanger / Illumina 1.9",
        gc: faker.number.int(),
        length: [faker.number.int(), faker.number.int()],
        sequences: Array.from({ length: 10 }, () => faker.number.int()),
    };
}

/**
 * Create a fake sample object
 */
export function createFakeSample(overrides?: Partial<Sample>): Sample {
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
        locale: faker.location.country(),
        paired: faker.datatype.boolean(),
        quality: createFakeSampleQuality(),
        reads: [createFakeSampleRead()],
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
 * Sets up a mocked API route for fetching a single sample
 *
 * @param sampleDetail - The sample detail to be returned from the mocked API call
 * @param statusCode - The HTTP status code to simulate in the response
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSampleDetail(
    sampleDetail: Sample,
    statusCode?: number,
) {
    return nock("http://localhost")
        .get(`/api/samples/${sampleDetail.id}`)
        .query(true)
        .reply(statusCode || 200, sampleDetail);
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

    return nock("http://localhost")
        .patch(`/api/samples/${sample.id}`)
        .reply(200, sampleDetail);
}

/**
 * Sets up a mocked API route for updating a samples rights
 *
 * @param sample - The sample details
 * @param update - The update to be applied
 * @returns A nock scope for the mocked API call
 */
export function mockApiUpdateSampleRights(
    sample: Sample,
    update: SampleRightsUpdate,
) {
    const sampleRightsUpdate = {
        all_read: faker.datatype.boolean(),
        all_write: faker.datatype.boolean(),
        group: null,
        group_read: faker.datatype.boolean(),
        group_write: faker.datatype.boolean(),
        user: { id: sample.user.id },
        ...update,
    };

    return nock("http://localhost")
        .patch(`/api/samples/${sample.id}/rights`)
        .reply(200, sampleRightsUpdate);
}

/**
 * Creates a mocked API call for creating a sample
 *
 * @param name - The name of the sample
 * @param isolate - The sample isolate
 * @param host - The sample host
 * @param locale - The locale of the sample
 * @param library_type - The library type of the sample
 * @param files - The sample uploads used to create the sample
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
    files: number[],
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
        subtractions: [createFakeSubtractionNested({ id: subtractions[0] })],
    });

    return nock("http://localhost")
        .post("/api/samples", {
            name,
            isolate,
            host,
            locale,
            library_type,
            files,
            labels,
            subtractions,
            group,
        })
        .reply(201, sample);
}

/**
 * Creates a mocked API call for removing a sample
 *
 * @param sampleId - The id of the sample being removed
 * @returns The nock scope for the mocked API call
 */
export function mockApiRemoveSample(sampleId: string) {
    return nock("http://localhost")
        .delete(`/api/samples/${sampleId}`)
        .reply(200);
}
