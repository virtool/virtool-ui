import { faker } from "@faker-js/faker";
import { assign } from "lodash";
import nock from "nock";
import { OTUMinimal } from "../../js/otus/types";
import { createFakeReferenceNested } from "./references";

type CreateFakeOTUMinimalProps = {
    verified?: boolean;
};

/**
 * Create a fake HMM minimal
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
