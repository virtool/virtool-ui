import { faker } from "@faker-js/faker";
import { UpdateOTUProps } from "@otus/queries";
import {
    HistoryMethod,
    HistoryNested,
    Otu,
    OtuIsolate,
    OtuMinimal,
    OtuSegment,
    OtuSequence,
} from "@otus/types";
import { assign, merge } from "lodash";
import nock from "nock";
import { createFakeReferenceNested } from "./references";
import { createFakeUserNested } from "./user";

/**
 * Create a fake history nested
 */
export function createFakeHistoryNested(): HistoryNested {
    return {
        created_at: faker.date.past().toISOString(),
        description: faker.lorem.lines(1),
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        method_name: HistoryMethod.create,
        user: createFakeUserNested(),
    };
}

/**
 * Create a fake OTU sequence
 */
export function createFakeOTUSequence(
    overrides?: Partial<OtuSequence>,
): OtuSequence {
    const sequence = {
        accession: faker.word.noun({ strategy: "any-length" }),
        definition: faker.word.noun({ strategy: "any-length" }),
        host: faker.word.noun({ strategy: "any-length" }),
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        remote: null,
        segment: null,
        sequence: faker.word.noun({ strategy: "any-length" }),
        target: null,
    };

    return merge(sequence, overrides);
}

/**
 * Create a fake OTU isolate
 */
export function createFakeOTUIsolate(): OtuIsolate {
    return {
        default: false,
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        sequences: [createFakeOTUSequence()],
        source_name: faker.word.noun({ strategy: "any-length" }),
        source_type: faker.word.noun({ strategy: "any-length" }),
    };
}

/**
 * Create a fake OTU segment
 */
export function createFakeOtuSegment(): OtuSegment {
    return {
        molecule: null,
        name: faker.word.noun({ strategy: "any-length" }),
        required: false,
    };
}

/**
 * Create a fake minimal OTU
 */
export function createFakeOTUMinimal(
    overrides?: Partial<OtuMinimal>,
): OtuMinimal {
    const defaultOTUMinimal = {
        abbreviation: `${faker.string.fromCharacters("AHJKYUIQWE", { min: 2, max: 4 })}V`,
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        name: faker.word.noun({ strategy: "any-length" }),
        reference: createFakeReferenceNested(),
        verified: true,
        version: faker.number.int({ max: 10 }),
    };

    return assign(defaultOTUMinimal, overrides);
}

/**
 * Create a fake OTU object.
 */
export function createFakeOtu(overrides?: Partial<Otu>): Otu {
    const { isolates, issues, remote, ...props } = overrides || {};
    return {
        ...createFakeOTUMinimal(props),
        isolates: isolates || [createFakeOTUIsolate()],
        issues: issues || null,
        last_indexed_version: null,
        most_recent_change: createFakeHistoryNested(),
        schema: Array.from({ length: 2 }, createFakeOtuSegment),
        remote: remote || null,
    };
}

/**
 * Sets up a mocked API route for fetching a single complete otu
 *
 * @param otu - The complete otu
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetOtu(otu: Otu) {
    return nock("http://localhost")
        .get(`/api/otus/${otu.id}`)
        .query(true)
        .reply(200, otu);
}

/**
 * Sets up a mocked API route for fetching a list of OTUs
 *
 * @param OTUMinimal - The OTU documents
 * @param refId - The id of the reference which the OTUs belong to
 * @returns The nock scope for the mocked API call
 */
export function mockApiFindOtus(OTUMinimal: OtuMinimal[], refId: string) {
    return nock("http://localhost")
        .get(`/api/refs/${refId}/otus`)
        .query(true)
        .reply(200, {
            documents: OTUMinimal,
            modified_count: faker.number.int(),
            found_count: faker.number.int(),
            page: faker.number.int(),
            page_count: faker.number.int(),
            per_page: faker.number.int(),
            total_count: faker.number.int(),
        });
}

/**
 * Sets up a mocked API route for creating an OTU
 *
 * @param refId - The unique identifier of the parent reference of the new OTU
 * @param name - The name of the new OTU
 * @param abbreviation - The shorthand name for the new otu
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateOTU(
    refId: string,
    name: string,
    abbreviation: string,
) {
    const OTU = createFakeOtu({
        name,
        abbreviation,
    });

    return nock("http://localhost")
        .post(`/api/refs/${refId}/otus`, { name, abbreviation })
        .reply(201, OTU);
}

/**
 * Mocks an API call for updating the OTU details
 *
 * @param otu - The OTU details
 * @param update - The update to apply to the OTU
 * @returns A nock scope for the mocked API call
 */
export function mockApiEditOTU(otu: Otu, update: UpdateOTUProps) {
    const OTUDetail = { otu, ...update };

    return nock("http://localhost")
        .patch(`/api/otus/${otu.id}`)
        .reply(200, OTUDetail);
}

/**
 * Creates a mocked API call for removing an OTU
 *
 * @param otuId - The id of the OTU being removed
 * @returns The nock scope for the mocked API call
 */
export function mockApiRemoveOTU(otuId: string) {
    return nock("http://localhost").delete(`/api/otus/${otuId}`).reply(200);
}

/**
 * Creates a mocked API call for creating an OTU isolate
 *
 * @param otuId - The id of the OTU being updated
 * @param sourceName - The source name
 * @param sourceType - The source type
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateIsolate(
    otuId: string,
    sourceName: string,
    sourceType: string,
) {
    return nock("http://localhost")
        .post(`/api/otus/${otuId}/isolates`, {
            source_name: sourceName,
            source_type: sourceType,
        })
        .reply(201, {
            default: faker.datatype.boolean(),
            id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
            sequences: [],
            source_name: sourceName,
            source_type: sourceType,
        });
}

/**
 * Creates a mocked API call for removing an OTU isolate
 *
 * @param otuId - The id of the OTU being updated
 * @param isolateId - The id of the isolate to remove
 * @returns The nock scope for the mocked API call
 */
export function mockApiRemoveIsolate(otuId: string, isolateId: string) {
    return nock("http://localhost")
        .delete(`/api/otus/${otuId}/isolates/${isolateId}`)
        .reply(200);
}

/**
 * Creates a mocked API call for adding a sequence
 *
 * @param otuId - The id of the OTU
 * @param isolateId - The id of the isolate
 * @param accession - The accession ID for the sequence
 * @param definition - The sequence definition
 * @param host - The host for the sequence
 * @param sequence - The sequence characters assigned
 * @param segment - The segment assigned
 * @param target - The target assigned
 * @returns The nock scope for the mocked API call
 */
export function mockApiAddSequence(
    otuId: string,
    isolateId: string,
    accession: string,
    definition: string,
    host: string,
    sequence: string,
    segment?: string,
    target?: string,
) {
    const OTUSequence = createFakeOTUSequence({
        accession,
        definition,
        host,
        sequence,
        segment,
        target,
    });

    return nock("http://localhost")
        .post(`/api/otus/${otuId}/isolates/${isolateId}/sequences`)
        .query(true)
        .reply(201, OTUSequence);
}

/**
 * Creates a mocked API call for editing a sequence
 *
 * @param otuId - The id of the OTU
 * @param isolateId - The id of the isolate
 * @param sequenceId - The id of the sequence ot edit
 * @param accession - The accession ID for the sequence
 * @param definition - The sequence definition
 * @param host - The host for the sequence
 * @param sequence - The sequence characters assigned
 * @param segment - The segment assigned
 * @param target - The target assigned
 * @returns The nock scope for the mocked API call
 */
export function mockApiEditSequence(
    otuId: string,
    isolateId: string,
    sequenceId: string,
    accession: string,
    definition: string,
    host: string,
    sequence: string,
    segment?: string,
    target?: string,
) {
    const OTUSequence = createFakeOTUSequence({
        accession,
        definition,
        host,
        sequence,
        segment,
        target,
    });

    return nock("http://localhost")
        .patch(
            `/api/otus/${otuId}/isolates/${isolateId}/sequences/${sequenceId}`,
            {
                accession,
                definition,
                host,
                segment,
                sequence,
                target,
            },
        )
        .query(true)
        .reply(201, OTUSequence);
}

/**
 * Creates a mocked API call for removing an OTU isolate
 *
 * @param otuId - The id of the OTU being updated
 * @param isolateId - The id of the isolate being updated
 * @param sequenceId - The id of the sequence being removed
 * @returns The nock scope for the mocked API call
 */
export function mockApiRemoveSequence(
    otuId: string,
    isolateId: string,
    sequenceId: string,
) {
    return nock("http://localhost")
        .delete(
            `/api/otus/${otuId}/isolates/${isolateId}/sequences/${sequenceId}`,
        )
        .reply(200);
}
