import { Task } from "@/types/api";
import { faker } from "@faker-js/faker";
import {
    Reference,
    ReferenceClonedFrom,
    ReferenceMinimal,
    ReferenceTarget,
} from "@references/types";
import { assign } from "lodash-es";
import nock from "nock";
import { createFakeUserNested } from "./user";

/**
 * Create a fake reference target
 */
export function createFakeReferenceTarget(): ReferenceTarget {
    return {
        description: faker.lorem.lines(1),
        length: faker.number.int(),
        name: faker.word.noun(),
        required: true,
    };
}

type CreateFakeReferenceNestedParams = {
    id?: string;
    name?: string;
};

/**
 * Create a fake reference nested
 */
export function createFakeReferenceNested(
    params?: CreateFakeReferenceNestedParams,
) {
    return {
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        data_type: "genome",
        name: faker.word.noun(),
        ...params,
    };
}

type CreateFakeReferenceMinimalParams = CreateFakeReferenceNestedParams & {
    cloned_from?: ReferenceClonedFrom | null;
    organism?: string;
    task?: Task;
};

/**
 * Create a fake reference minimal
 */
export function createFakeReferenceMinimal(
    params?: CreateFakeReferenceMinimalParams,
): ReferenceMinimal {
    const defaultReferenceMinimal = {
        ...createFakeReferenceNested(params),
        cloned_from: {
            id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
            name: faker.word.noun(),
        },
        created_at: faker.date.past().toISOString(),
        imported_from: null,
        installed: null,
        internal_control: faker.word.noun(),
        latest_build: null,
        organism: faker.word.noun(),
        otu_count: faker.number.int(),
        release: null,
        remotes_from: null,
        task: {
            complete: true,
        },
        unbuilt_change_count: faker.number.int(),
        updating: false,
        user: createFakeUserNested(),
    };

    return assign(defaultReferenceMinimal, params);
}

type CreateFakeReferenceParams = CreateFakeReferenceMinimalParams & {
    description?: string;
    targets?: ReferenceTarget[];
};

/**
 * Create a fake reference
 */
export function createFakeReference(
    overrides?: CreateFakeReferenceParams,
): Reference {
    const { description, ...props } = overrides || {};

    const defaultReference = {
        ...createFakeReferenceMinimal(props),
        contributors: [],
        description: description || "",
        groups: [],
        restrict_source_types: false,
        source_types: ["isolate", "strain"],
        targets: [createFakeReferenceTarget()],
        users: [
            {
                ...createFakeUserNested(),
                build: true,
                created_at: faker.date.past().toISOString(),
                modify: true,
                modify_otu: true,
                remove: true,
            },
        ],
    };

    return assign(defaultReference, props);
}

/**
 * Sets up a mocked API route for fetching a list of references
 *
 * @param references - The documents for references
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetReferences(references: ReferenceMinimal[]) {
    return nock("http://localhost").get("/api/refs").query(true).reply(200, {
        documents: references,
        found_count: references.length,
        page: 1,
        page_count: 1,
        per_page: 25,
        ready_count: references.length,
        total_count: references.length,
    });
}

/**
 * Sets up a mocked API route for fetching a single reference
 *
 * @param referenceDetail - The reference detail to be returned from the mocked API call
 * @param statusCode - The HTTP status code to simulate in the response
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetReferenceDetail(
    referenceDetail: Reference,
    statusCode?: number,
) {
    return nock("http://localhost")
        .get(`/api/refs/${referenceDetail.id}`)
        .query(true)
        .reply(statusCode || 200, referenceDetail);
}

/**
 * Sets up a mocked API route for cloning a reference
 *
 * @param name - The name of the clone
 * @param description - The description of the clone
 * @param reference - The reference being cloned
 * @returns The nock scope for the mocked API call
 */
export function mockApiCloneReference(
    name: string,
    description: string,
    reference: ReferenceMinimal,
) {
    const clonedReference = createFakeReference({
        cloned_from: {
            id: reference.id,
            name: reference.name,
        },
        name: name,
        description: description,
    });

    return nock("http://localhost")
        .post("/api/refs", {
            name: name,
            description: description,
            clone_from: reference.id,
        })
        .reply(201, clonedReference);
}

/**
 * Sets up a mocked API route for creating an empty reference
 *
 * @param name - The name of the reference
 * @param description - The description of the reference
 * @param organism - The organism of the reference
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateReference(
    name: string,
    description: string,
    organism: string,
) {
    const reference = createFakeReference({
        name,
        description,
        organism,
    });

    return nock("http://localhost")
        .post("/api/refs", { data_type: "genome", description, name, organism })
        .reply(201, reference);
}

/**
 * Sets up a mocked API route for deleting a reference
 *
 * @param referenceId - The reference to be removed
 * @returns A nock scope for the mocked API call
 */
export function mockApiRemoveReference(referenceId: string) {
    return nock("http://localhost")
        .delete(`/api/refs/${referenceId}`)
        .reply(200);
}
