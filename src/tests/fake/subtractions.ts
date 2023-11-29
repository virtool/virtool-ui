import { faker } from "@faker-js/faker";
import { merge } from "lodash";
import nock from "nock";
import { JobMinimal } from "../../js/jobs/types";
import { SampleNested } from "../../js/samples/types";
import {
    NucleotideComposition,
    Subtraction,
    SubtractionFile,
    SubtractionMinimal,
    SubtractionUpload,
} from "../../js/subtraction/types";
import { UserNested } from "../../js/users/types";
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

type CreateFakeSubtraction = CreateFakeSubtractionMinimal & {
    files?: Array<SubtractionFile>;
    gc?: NucleotideComposition;
    linked_samples?: Array<SampleNested>;
};

/**
 * Create a fake subtraction
 */
export function createFakeSubtraction(overrides?: CreateFakeSubtraction): Subtraction {
    const { files, gc, linked_samples, ...props } = overrides || {};
    return {
        ...createFakeSubtractionMinimal(props),
        files: files || [createFakeSubtractionFile()],
        gc: gc || { a: 1, c: 1, g: 1, n: 1, t: 1 },
        linked_samples: linked_samples || [],
    };
}

type CreateFakeSubtractionMinimal = {
    id?: string;
    name?: string;
    count?: number;
    created_at?: string;
    file?: SubtractionUpload;
    job?: JobMinimal;
    nickname?: string;
    ready?: boolean;
    user?: UserNested;
};

/**
 * Create a fake minimal subtraction
 */
export function createFakeSubtractionMinimal(overrides?: CreateFakeSubtractionMinimal): SubtractionMinimal {
    const defaultSubtractionMinimal = {
        id: faker.random.alphaNumeric(8),
        name: faker.random.word(),
        count: faker.datatype.number(),
        created_at: faker.date.past().toISOString(),
        file: { id: faker.random.alphaNumeric(8), name: faker.random.word() },
        job: {},
        nickname: faker.random.word(),
        ready: true,
        user: createFakeUserNested(),
    };

    return merge(defaultSubtractionMinimal, overrides);
}

/**
 * Sets up a mocked API route for fetching a list of subtractions
 *
 * @param Subtractions - The list of subtractions to be returned from the mocked API call
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSubtractions(Subtractions: SubtractionMinimal[]) {
    return nock("http://localhost").get("/api/subtractions").query(true).reply(200, {
        documents: Subtractions,
        found_count: Subtractions.length,
        page: 1,
        page_count: 1,
        per_page: 25,
        ready_count: Subtractions.length,
        total_count: Subtractions.length,
    });
}
