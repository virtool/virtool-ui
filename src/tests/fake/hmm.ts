import { faker } from "@faker-js/faker";
import { Hmm, HmmSearchResults } from "@hmm/types";
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
        names: [faker.person.lastName()],
    };
}

/**
 * Create a fake HMM
 */
export function createFakeHmm() {
    function entries() {
        return {
            accession: `${faker.word.noun({ strategy: "any-length" })}.1`,
            gi: faker.number.int({ min: 10000, max: 100000 }).toString(),
            name: faker.word.noun({ strategy: "any-length" }),
            organism: faker.animal.type(),
        };
    }

    return {
        ...createFakeHmmMinimal(),
        entries: Array.from({ length: 2 }, entries),
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

/**
 * Create a fake Hmm search result
 *
 * @param overrides - optional properties for creating a fake Hmm search result with specific values
 */
export function createFakeHmmSearchResults(
    overrides?: Partial<HmmSearchResults>,
): HmmSearchResults {
    return {
        documents: Array.from({ length: 5 }, createFakeHmmMinimal),
        status: {
            errors: [faker.internet.httpStatusCode().toString()],
            installed: {
                ready: faker.datatype.boolean(),
            },
            task: {
                complete: true,
            },
        },
        found_count: faker.number.int(),
        page: faker.number.int(),
        page_count: faker.number.int(),
        per_page: faker.number.int(),
        total_count: faker.number.int(),
        ...overrides,
    };
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
export function mockApiGetHmmDetail(hmmDetail: Hmm, statusCode?: number) {
    return nock("http://localhost")
        .get(`/api/hmms/${hmmDetail.id}`)
        .query(true)
        .reply(statusCode || 200, hmmDetail);
}
