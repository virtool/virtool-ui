import { faker } from "@faker-js/faker";
import { times, toString } from "lodash-es";
import nock from "nock";
import { HMMSearchResults } from "../../js/hmm/types";

/**
 * Create a fake HMM search result before installation
 *
 * @param hasTask - Whether the status has a task
 */
export function createFakeInitialHMMSearchResults(hasTask = false) {
    const status = {
        installed: null,
        task: hasTask && {
            complete: false,
            id: 21,
            progress: 33,
            step: "decompress",
        },
    };
    return {
        documents: [],
        status,
        found_count: 0,
        page: 1,
        page_count: 0,
        per_page: faker.datatype.number(),
        total_count: 0,
    };
}

/**
 * Create a fake HMM search result
 *
 * @param hasDocument - Whether the search result has documents
 */
export function createFakeHMMSearchResults(hasDocument = true): HMMSearchResults {
    const status = {
        errors: [toString(faker.internet.httpStatusCode())],
        installed: {
            ready: faker.datatype.boolean(),
        },
    };

    const documents = times(5, () => ({
        cluster: faker.datatype.number(),
        count: faker.datatype.number(),
        families: {
            None: faker.datatype.number(),
            Papillomaviridae: faker.datatype.number(),
        },
        id: faker.random.alphaNumeric(9, { casing: "lower" }),
        names: [faker.name.lastName()],
    }));

    return {
        documents: hasDocument ? documents : [],
        status,
        found_count: faker.datatype.number(),
        page: faker.datatype.number(),
        page_count: faker.datatype.number(),
        per_page: faker.datatype.number(),
        total_count: faker.datatype.number(),
    };
}

/**
 * Sets up a mocked API route for fetching a list of HMMs
 *
 * @param hmm - The hmm search results to be returned from the mocked API call
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetHmms(hmm: HMMSearchResults) {
    return nock("http://localhost").get("/api/hmms").query(true).reply(200, hmm);
}
