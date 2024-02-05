import { faker } from "@faker-js/faker";
import nock from "nock";

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
