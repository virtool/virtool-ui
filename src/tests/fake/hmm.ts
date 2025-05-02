import { faker } from "@faker-js/faker";
import { assign, times, toString } from "lodash-es";
import nock from "nock";
import { HMM, HmmSearchResults } from "../../hmm/types";

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

/**
 * Create a fake HMM
 */
export function createFakeHMM() {
    function entries() {
        return {
            accession: faker.random.word(),
            gi: faker.random.word(),
            name: faker.random.word(),
            organism: faker.random.word(),
        };
    }

    return {
        ...createFakeHMMMinimal(),
        entries: times(2, () => entries()),
        genera: {
            Curtovirus: faker.datatype.number(),
            Begomovirus: faker.datatype.number(),
        },
        length: faker.datatype.number(),
        mean_entropy: faker.datatype.float({ min: 0, max: 1, precision: 0.01 }),
        total_entropy: faker.datatype.float({
            min: 100,
            max: 200,
            precision: 0.01,
        }),
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
export function createFakeHMMSearchResults(
    overrides?: CreateFakeHMMSearchResults,
): HmmSearchResults {
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
export function mockApiGetHmms(hmmSearchResults: HmmSearchResults) {
    return nock("http://localhost")
        .get("/api/hmms")
        .query(true)
        .reply(200, hmmSearchResults);
}

/**
 * Sets up a mocked API route for fetching a single HMM
 *
 * @param hmmDetail - The hmm detail to be returned from the mocked API call
 * @param statusCode - The HTTP status code to simulate in the response
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetHmmDetail(hmmDetail: HMM, statusCode?: number) {
    return nock("http://localhost")
        .get(`/api/hmms/${hmmDetail.id}`)
        .query(true)
        .reply(statusCode || 200, hmmDetail);
}
