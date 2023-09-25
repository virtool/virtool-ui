import { faker } from "@faker-js/faker";
import { merge } from "lodash";
import nock from "nock";
import { IndexMinimal, IndexNested } from "../../js/indexes/types";
import { JobMinimal } from "../../js/jobs/types";
import { ReferenceNested } from "../../js/references/types";
import { UserNested } from "../../js/users/types";
import { createFakeJobMinimal } from "./jobs";
import { createFakeReferenceNested } from "./references";
import { createFakeUserNested } from "./user";
import { FakeSearchResults } from "./utils";

type CreateFakeIndexNestedProps = {
    id?: string;
    version?: number;
};

export function createFakeIndexNested(props?: CreateFakeIndexNestedProps): IndexNested {
    const defaultIndexNested = {
        id: faker.random.alphaNumeric(8),
        version: faker.datatype.number(5),
    };

    return merge(defaultIndexNested, props);
}

type createFakeIndexMinimalProps = CreateFakeIndexNestedProps & {
    change_count?: number;
    created_at?: string;
    has_files?: boolean;
    job?: JobMinimal;
    modified_out_count?: number;
    reference?: ReferenceNested;
    user?: UserNested;
    ready?: boolean;
};

export function createFakeIndexMinimal(props: createFakeIndexMinimalProps): IndexMinimal {
    const defaultIndexMinimal = {
        ...createFakeIndexNested(),
        change_count: faker.datatype.number({ min: 2, max: 10 }),
        created_at: faker.date.past().toISOString(),
        has_files: faker.datatype.boolean(),
        job: createFakeJobMinimal(),
        modified_otu_count: faker.datatype.number({ min: 2, max: 10 }),
        reference: createFakeReferenceNested(),
        user: createFakeUserNested(),
        ready: faker.datatype.boolean(),
    };

    return merge(defaultIndexMinimal, props);
}

type IndexSearchResults = FakeSearchResults & {
    documents: IndexMinimal[];
    modified_otu_count?: number;
    total_otu_count?: number;
    change_count?: number;
};

export function mockApiFindIndexes(refId: string, page: number, searchResults: IndexSearchResults) {
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

export function mockApiBuildIndexes(refId: string) {
    return nock("http://localhost").post(`/api/refs/${refId}/indexes`).reply(201);
}
