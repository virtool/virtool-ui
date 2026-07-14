import type { Reference, ReferenceMinimal } from "@references/types";
import nock from "nock";
import { createFakeReference } from "../fake/references";

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
 * Sets up a mocked API route for archiving a reference
 *
 * @param refId - The id of the reference being archived
 * @param response - The reference returned in the response body
 * @param statusCode - Optional HTTP status code; defaults to 200
 * @returns The nock scope for the mocked API call
 */
export function mockApiArchiveReference(
	refId: string,
	response: Reference,
	statusCode = 200,
) {
	return nock("http://localhost")
		.post(`/api/refs/${refId}/archive`)
		.reply(statusCode, response);
}

/**
 * Sets up a mocked API route for unarchiving a reference
 *
 * @param refId - The id of the reference being unarchived
 * @param response - The reference returned in the response body
 * @param statusCode - Optional HTTP status code; defaults to 200
 * @returns The nock scope for the mocked API call
 */
export function mockApiUnarchiveReference(
	refId: string,
	response: Reference,
	statusCode = 200,
) {
	return nock("http://localhost")
		.post(`/api/refs/${refId}/unarchive`)
		.reply(statusCode, response);
}
