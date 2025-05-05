import { faker } from "@faker-js/faker";
import { HMM, HMMSearchResults } from "@hmm/types";
import { assign, times, toString } from "lodash-es";
import nock from "nock";

/**
 * Create a fake HMM minimal
 */
export function createFakeHmmMinimal() {
    return {
        cluster: faker.number.int(),
        count: faker.number.int(),
        families: {
            None: faker.number.int(),
            Papillomaviridae: faker.number.int(),
        },
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        names: [faker.name.lastName()],
    };
}

/**
 * Create a fake HMM
 */
export function createFakeHmm() {
    function entries() {
        return {
            accession: `${faker.word.noun()}.1`,
            gi: faker.number.int({ min: 10000, max: 100000 }).toString(),
            name: faker.word.noun(),
            organism: faker.animal.type(),
        };
    }

    return {
        ...createFakeHmmMinimal(),
        entries: times(2, () => entries()),
        genera: {
            Curtovirus: faker.number.int(),
            Begomovirus: faker.number.int(),
        },
        length: faker.number.int(),
        mean_entropy: faker.number.float({ min: 0, max: 1 }),
        total_entropy: faker.number.float({
            min: 100,
            max: 200,
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
        documents: times(5, () => createFakeHmmMinimal()),
        status: defaultStatus,
        found_count: faker.number.int(),
        page: faker.number.int(),
        page_count: faker.number.int(),
        per_page: faker.number.int(),
        total_count: faker.number.int(),
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
