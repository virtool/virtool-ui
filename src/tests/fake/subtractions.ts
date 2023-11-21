import { faker } from "@faker-js/faker";
import nock from "nock";
import { Subtraction, SubtractionFile, SubtractionMinimal } from "../../js/subtraction/types";
import { createFakeUserNested } from "./user";

/**
 * Create a fake subtraction file
 */
export function createFakeSubtractionFile(): SubtractionFile {
    return {
        download_url: faker.random.word(),
        id: faker.datatype.number(),
        name: faker.random.word(),
        size: faker.datatype.number(),
        subtraction: faker.random.alphaNumeric(8),
        type: "fasta",
    };
}

/**
 * Create a fake subtraction
 */
export function createFakeSubtraction(subtractionMinimal: SubtractionMinimal): Subtraction {
    return {
        ...subtractionMinimal,
        files: [createFakeSubtractionFile()],
        gc: { a: 1, c: 1, g: 1, n: 1, t: 1 },
        linked_samples: [],
    };
}

/**
 * Create a fake minimal subtraction
 */
export function createFakeSubtractionMinimal(): SubtractionMinimal {
    return {
        id: faker.random.alphaNumeric(8),
        created_at: faker.date.past().toISOString(),
        name: faker.random.word(),
        ready: true,
        user: createFakeUserNested(),
        file: { id: faker.random.alphaNumeric(8), name: faker.random.word() },
        nickname: faker.random.word(),
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
