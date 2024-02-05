import { faker } from "@faker-js/faker";
import nock from "nock";

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
