import { faker } from "@faker-js/faker";
import nock from "nock";
import { SubtractionMinimal } from "../../js/subtraction/types";
import { createFakeUserNested } from "./user";

/**
 * Create a fake minimal subtraction
 */
export function createFakeSubtractions(): SubtractionMinimal {
    return {
        id: faker.random.alphaNumeric(8),
        created_at: faker.date.past().toISOString(),
        name: faker.random.word(),
        ready: true,
        user: createFakeUserNested(),
        file: { id: faker.random.alphaNumeric(8), name: faker.random.word() },
        nickname: "",
    };
}

/**
 * Sets up a mocked API route for fetching a list of subtractions
 *
 * @param Subtractions - The list of subtractions to be returned from the mocked API call
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSubtractions(Subtractions: SubtractionMinimal[]) {
    return nock("http://localhost")
        .get("/api/subtractions")
        .query(true)
        .reply(200, { documents: Subtractions, total_count: 1 });
}
