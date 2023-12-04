import { faker } from "@faker-js/faker";
import { assign, times, toString } from "lodash-es";
import nock from "nock";
import { HMMSearchResults } from "../../js/hmm/types";

/**
 * Create a fake HMM minimal
 */
export function createFakeHMMMinimal() {
    return {
        cluster: faker.datatype.number(),
        count: faker.datatype.number(),
        families: {
            None: faker.datatype.number(),
            Papillomaviridae: faker.datatype.number(),
        },
        id: faker.random.alphaNumeric(9, { casing: "lower" }),
        names: [faker.name.lastName()],
    };
}

type CreateFakeHMMSearchResults = {
    documents?: string[];
    status?: { [key: string]: any };
    total_count?: number;
};

/**
 * Create a fake HMM search result
 *
 * @param overrides - optional properties for creating a fake HHM search result with specific values
 */
export function createFakeHMMSearchResults(overrides?: CreateFakeHMMSearchResults): HMMSearchResults {
    const defaultStatus = {
        errors: [toString(faker.internet.httpStatusCode())],
        installed: {
            ready: faker.datatype.boolean(),
        },
        task: {
            complete: true,
        },
    };

    const defaultHMMSearchResult = {
        documents: times(5, () => createFakeHMMMinimal()),
        status: defaultStatus,
        found_count: faker.datatype.number(),
        page: faker.datatype.number(),
        page_count: faker.datatype.number(),
        per_page: faker.datatype.number(),
        total_count: faker.datatype.number(),
    };

    return assign(defaultHMMSearchResult, overrides);
}

/**
 * Sets up a mocked API route for fetching a list of HMMs
 *
 * @param hmmSearchResults - The hmm search results to be returned from the mocked API call
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetHmms(hmmSearchResults: HMMSearchResults) {
    return nock("http://localhost").get("/api/hmms").query(true).reply(200, hmmSearchResults);
}
