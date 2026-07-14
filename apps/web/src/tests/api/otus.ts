import { faker } from "@faker-js/faker";
import type { UpdateOtuProps } from "@otus/queries";
import type { Otu, OtuMinimal } from "@otus/types";
import nock from "nock";
import { createFakeOtu, createFakeOtuSequence } from "../fake/otus";

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
 * @param otus - The OTU documents
 * @param refId - The id of the reference which the OTUs belong to
 * @returns The nock scope for the mocked API call
 */
export function mockApiFindOtus(otus: OtuMinimal[], refId: string) {
	return nock("http://localhost")
		.get(`/api/refs/${refId}/otus`)
		.query(true)
		.reply(200, {
			documents: otus,
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
export function mockApiCreateOtu(
	refId: string,
	name: string,
	abbreviation: string,
) {
	const otu = createFakeOtu({
		name,
		abbreviation,
	});

	return nock("http://localhost")
		.post(`/api/refs/${refId}/otus`, { name, abbreviation })
		.reply(201, otu);
}

/**
 * Mocks an API call for updating the OTU details
 *
 * @param otu - The OTU details
 * @param update - The update to apply to the OTU
 * @returns A nock scope for the mocked API call
 */
export function mockApiEditOtu(otu: Otu, update: UpdateOtuProps) {
	const otuDetail = { otu, ...update };

	return nock("http://localhost")
		.patch(`/api/otus/${otu.id}`)
		.reply(200, otuDetail);
}

/**
 * Creates a mocked API call for removing an OTU
 *
 * @param otuId - The id of the OTU being removed
 * @returns The nock scope for the mocked API call
 */
export function mockApiRemoveOtu(otuId: string) {
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
) {
	const fakeSequence = createFakeOtuSequence({
		accession,
		definition,
		host,
		sequence,
		segment,
	});

	return nock("http://localhost")
		.post(`/api/otus/${otuId}/isolates/${isolateId}/sequences`)
		.query(true)
		.reply(201, fakeSequence);
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
	segment?: string | null,
) {
	const fakeSequence = createFakeOtuSequence({
		accession,
		definition,
		host,
		sequence,
		segment,
	});

	return nock("http://localhost")
		.patch(`/api/otus/${otuId}/isolates/${isolateId}/sequences/${sequenceId}`, {
			accession,
			definition,
			host,
			segment,
			sequence,
		})
		.query(true)
		.reply(201, fakeSequence);
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
		.delete(`/api/otus/${otuId}/isolates/${isolateId}/sequences/${sequenceId}`)
		.reply(200);
}
