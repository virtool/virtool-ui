import { faker } from "@faker-js/faker";
import { IndexFile, IndexMinimal, IndexNested } from "@indexes/types";
import { JobMinimal } from "@jobs/types";
import { ReferenceNested } from "@references/types";
import { UserNested } from "@users/types";
import { merge } from "lodash";
import { assign } from "lodash-es";
import nock from "nock";
import { createFakeJobMinimal } from "./jobs";
import { createFakeReferenceNested } from "./references";
import { createFakeUserNested } from "./user";
import { BaseFakeSearchResultOptions } from "./utils";

type CreateFakeIndexNestedProps = {
    id?: string;
    version?: number;
};

export function createFakeIndexNested(
    props?: CreateFakeIndexNestedProps,
): IndexNested {
    const defaultIndexNested = {
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        version: faker.number.int({ max: 10 }),
    };

    return assign(defaultIndexNested, props);
}

type CreateFakeIndexMinimalProps = CreateFakeIndexNestedProps & {
    change_count?: number;
    created_at?: string;
    has_files?: boolean;
    job?: JobMinimal;
    modified_out_count?: number;
    reference?: ReferenceNested;
    user?: UserNested;
    ready?: boolean;
};

export function createFakeIndexMinimal(
    props?: CreateFakeIndexMinimalProps,
): IndexMinimal {
    const defaultIndexMinimal = {
        ...createFakeIndexNested(),
        change_count: faker.number.int({ min: 2, max: 10 }),
        created_at: faker.date.past().toISOString(),
        has_files: faker.datatype.boolean(),
        job: createFakeJobMinimal(),
        modified_otu_count: faker.number.int({ min: 2, max: 10 }),
        reference: createFakeReferenceNested(),
        user: createFakeUserNested(),
        ready: faker.datatype.boolean(),
    };

    return assign(defaultIndexMinimal, props);
}

type CreateFakeIndexFile = {
    name?: string;
    download_url?: string;
    size?: number;
};

export function createFakeIndexFile(props?: CreateFakeIndexFile): IndexFile {
    const defaultIndexFile = {
        download_url: `/testUrl/${faker.word.noun({ strategy: "any-length" })}`,
        id: faker.number.int(),
        index: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        name: faker.word.noun({ strategy: "any-length" }),
        size: faker.number.int({ min: 20000 }),
        type: "fasta",
    };

    return assign(defaultIndexFile, props);
}

type IndexSearchResults = BaseFakeSearchResultOptions & {
    documents: IndexMinimal[];
    modified_otu_count?: number;
    total_otu_count?: number;
    change_count?: number;
};

export function mockApiFindIndexes(
    refId: string,
    page: number,
    searchResults: IndexSearchResults,
) {
    const defaultSearchResults = {
        page: 1,
        page_count: 1,
        total_count: searchResults.documents.length,
        found_count: searchResults.documents.length,
        per_page: 25,
    };

    return nock("http://localhost")
        .get(`/api/refs/${refId}/indexes`)
        .query(true)
        .reply(200, merge(defaultSearchResults, searchResults));
}

/**
 * Creates a mocked API call for getting a list of indexes
 *
 * @param indexMinimal - The index minimal documents
 * @returns The nock scope for the mocked API call
 */
export function mockApiListIndexes(indexMinimal: IndexMinimal[]) {
    return nock("http://localhost")
        .get("/api/indexes")
        .query(true)
        .reply(200, indexMinimal);
}

/**
 * Creates a mocked API call for getting a list of unbuilt changes for a reference
 *
 * @param refId - The id of the reference to fetch unbuilt changes for
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetUnbuiltChanges(refId: string) {
    return nock("http://localhost")
        .get(`/api/refs/${refId}/history?unbuilt=true`)
        .reply(200);
}

export function mockApiBuildIndexes(refId: string) {
    return nock("http://localhost")
        .post(`/api/refs/${refId}/indexes`)
        .reply(201);
}
