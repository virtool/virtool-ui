import { faker } from "@faker-js/faker";
import { merge } from "lodash";
import { assign } from "lodash-es";
import nock from "nock";
import {
    Reference,
    ReferenceClonedFrom,
    ReferenceDataType,
    ReferenceMinimal,
    ReferenceTarget,
} from "../../js/references/types";
import { Task } from "../../js/types";
import { createFakeUserNested } from "./user";

/**
 * Create a fake reference target
 */
export function createFakeReferenceTarget(): ReferenceTarget {
    return {
        description: faker.lorem.lines(1),
        length: faker.datatype.number(),
        name: faker.random.word(),
        required: true,
    };
}

type CreateFakeReferenceNestedProps = {
    id?: string;
    data_type?: ReferenceDataType;
    name?: string;
};

/**
 * Create a fake reference nested
 */
export function createFakeReferenceNested(
    props?: CreateFakeReferenceNestedProps,
) {
    const defaultReferenceNested = {
        id: faker.random.alphaNumeric(8),
        data_type: faker.helpers.arrayElement(["barcode", "genome"]),
        name: faker.random.word(),
    };

    return merge(defaultReferenceNested, props);
}

type CreateFakeReferenceMinimal = CreateFakeReferenceNestedProps & {
    cloned_from?: ReferenceClonedFrom | null;
    organism?: string;
    task?: Task;
};

/**
 * Create a fake reference minimal
 */
export function createFakeReferenceMinimal(
    props?: CreateFakeReferenceMinimal,
): ReferenceMinimal {
    const defaultReferenceMinimal = {
        ...createFakeReferenceNested(),
        cloned_from: {
            id: faker.random.alphaNumeric(8),
            name: faker.random.word(),
        },
        created_at: faker.date.past().toISOString(),
        imported_from: null,
        installed: true,
        internal_control: faker.random.word(),
        latest_built: null,
        organism: faker.random.word(),
        otu_count: faker.datatype.number(),
        release: null,
        remotes_from: null,
        task: {
            complete: true,
        },
        unbuilt_change_count: faker.datatype.number(),
        updating: false,
        user: createFakeUserNested(),
    };

    return assign(defaultReferenceMinimal, props);
}

type CreateFakeReference = CreateFakeReferenceMinimal & {
    description?: string;
    targets?: ReferenceTarget[];
};

/**
 * Create a fake reference
 */
export function createFakeReference(
    overrides?: CreateFakeReference,
): Reference {
    const { description, ...props } = overrides || {};

    const defaultReference = {
        ...createFakeReferenceMinimal(props),
        contributors: {},
        description: description || "",
        groups: [],
        restrict_source_types: false,
        source_types: ["isolate", "strain"],
        targets: [createFakeReferenceTarget()],
        users: {
            ...createFakeUserNested(),
            modify: true,
            remove: true,
            modify_otu: true,
        },
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
 * @param data_type - The data type of the reference
 * @param organism - The organism of the reference
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateReference(
    name: string,
    description: string,
    data_type: ReferenceDataType,
    organism: string,
) {
    const reference = createFakeReference({
        name,
        description,
        data_type,
        organism,
    });

    return nock("http://localhost")
        .post("/api/refs", { name, description, data_type, organism })
        .reply(201, reference);
}

/**
 * Mocks an API call for updating the reference details
 *
 * @param reference - The reference details
 * @param update - The update to apply to the reference
 * @returns A nock scope for the mocked API call
 */
export function mockApiEditReference(reference: Reference, update: any) {
    const referenceDetail = { reference, ...update };

    return nock("http://localhost")
        .patch(`/api/refs/${reference.id}`)
        .reply(200, referenceDetail);
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
