import { faker } from "@faker-js/faker";
import { assign } from "lodash";
import nock from "nock";
import { HistoryMethod, HistoryNested, OTU, OTUIsolate, OTUMinimal, OTURemote, OTUSegment } from "../../js/otus/types";
import { createFakeReferenceNested } from "./references";
import { createFakeUserNested } from "./user";

/**
 * Create a fake history nested
 */
export function createFakeHistoryNested(): HistoryNested {
    return {
        created_at: faker.date.past().toISOString(),
        description: faker.lorem.lines(1),
        id: faker.random.alphaNumeric(8),
        method_name: HistoryMethod.create,
        user: createFakeUserNested(),
    };
}

/**
 * Create a fake OTU sequence
 */
export function createFakeOTUSequence() {
    return {
        accession: faker.random.word(),
        definition: faker.random.word(),
        host: faker.random.word(),
        id: faker.random.alphaNumeric(8),
        remote: null,
        segment: null,
        sequence: faker.random.word(),
        target: null,
    };
}

/**
 * Create a fake OTU isolate
 */
export function createFakeOTUIsolate(): OTUIsolate {
    return {
        default: false,
        id: faker.random.alphaNumeric(8),
        sequences: [createFakeOTUSequence()],
        source_name: faker.random.word(),
        source_type: faker.random.word(),
    };
}

/**
 * Create a fake OTU segment
 */
export function createFakeOTUSegment(): OTUSegment {
    return {
        molecule: null,
        name: faker.random.word(),
        required: faker.datatype.boolean(),
    };
}

type CreateFakeOTUMinimalProps = {
    abbreviation?: string;
    name?: string;
    verified?: boolean;
};

/**
 * Create a fake minimal OTU
 *
 * @param overrides - optional properties for creating a minimal OTU with specific values
 */
export function createFakeOTUMinimal(overrides?: CreateFakeOTUMinimalProps): OTUMinimal {
    const defaultOTUMinimal = {
        abbreviation: faker.random.word(),
        id: faker.random.alphaNumeric(8),
        name: faker.random.word(),
        reference: createFakeReferenceNested(),
        verified: true,
        version: faker.datatype.number(),
    };

    return assign(defaultOTUMinimal, overrides);
}

type CreateFakeOTU = CreateFakeOTUMinimalProps & {
    isolates?: Array<OTUIsolate>;
    issues?: { [key: string]: any };
    remote?: OTURemote;
};

/**
 * Create a fake OTU
 */
export function createFakeOTU(overrides?: CreateFakeOTU): OTU {
    const { isolates, issues, remote, ...props } = overrides || {};
    return {
        ...createFakeOTUMinimal(props),
        isolates: isolates || [createFakeOTUIsolate()],
        issues: issues || null,
        last_indexed_version: null,
        most_recent_change: createFakeHistoryNested(),
        otu_schema: [createFakeOTUSegment()],
        remote: remote || null,
    };
}

/**
 * Sets up a mocked API route for fetching a list of OTUs
 *
 * @param OTUMinimal - The OTU documents
 * @param refId - The id of the reference which the OTUs belong to
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetOTUs(OTUMinimal: OTUMinimal[], refId: string) {
    return nock("http://localhost").get(`/api/refs/${refId}/otus`).query(true).reply(200, {
        documents: OTUMinimal,
        modified_count: faker.datatype.number(),
        found_count: faker.datatype.number(),
        page: faker.datatype.number(),
        page_count: faker.datatype.number(),
        per_page: faker.datatype.number(),
        total_count: faker.datatype.number(),
    });
}

/**
 * Sets up a mocked API route for creating an OTU
 *
 * @param refId - The unique identifier of the parent reference of the new OTU
 * @param name - The name of the new OTU
 * @param abbreviation - The shorthand name for the new otu
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateOTU(refId: string, name: string, abbreviation: string) {
    const OTU = createFakeOTU({
        name,
        abbreviation,
    });

    return nock("http://localhost").post(`/api/refs/${refId}/otus`, { name, abbreviation }).reply(201, OTU);
}

/**
 * Creates a mocked API call for removing an OTU
 *
 * @param otuId - The id of the OTU being removed
 * @returns The nock scope for the mocked API call
 */
export function mockApiRemoveOTU(otuId: string) {
    return nock("http://localhost").delete(`/api/otus/${otuId}`).reply(200);
}

/**
 * Creates a mocked API call for creating an OTU isolate
 *
 * @param otuId - The id of the OTU being updated
 * @param sourceName - The source name
 * @param sourceType - The source type
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateIsolate(otuId: string, sourceName: string, sourceType: string) {
    return nock("http://localhost")
        .post(`/api/otus/${otuId}/isolates`, { source_name: sourceName, source_type: sourceType })
        .reply(201, {
            default: faker.datatype.boolean(),
            id: faker.random.alphaNumeric(8),
            sequences: [],
            source_name: sourceName,
            source_type: sourceType,
        });
}

/**
 * Creates a mocked API call for removing an OTU isolate
 *
 * @param otuId - The id of the OTU being updated
 * @param isolateId - The id of the isolate to remove
 * @returns The nock scope for the mocked API call
 */
export function mockApiRemoveIsolate(otuId: string, isolateId: string) {
    return nock("http://localhost").delete(`/api/otus/${otuId}/isolates/${isolateId}`).reply(200);
}

/**
 * Creates a mocked API call for removing an OTU isolate
 *
 * @param otuId - The id of the OTU being updated
 * @param isolateId - The id of the isolate being updated
 * @param sequenceId - The id of the sequence being removed
 * @returns The nock scope for the mocked API call
 */
export function mockApiRemoveSequence(otuId: string, isolateId: string, sequenceId: string) {
    return nock("http://localhost")
        .delete(`/api/otus/${otuId}/isolates/${isolateId}/sequences/${sequenceId}`)
        .reply(200);
}
