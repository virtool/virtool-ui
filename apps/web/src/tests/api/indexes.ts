import type { IndexMinimal } from "@indexes/types";
import { merge } from "es-toolkit";
import nock from "nock";
import type { BaseFakeSearchResultOptions } from "../fake/utils";

type IndexSearchResults = BaseFakeSearchResultOptions & {
	documents: IndexMinimal[];
	modified_otu_count?: number;
	total_otu_count?: number;
	change_count?: number;
};

/**
 * Creates a mocked API call for finding the indexes of a reference
 *
 * @param refId - The id of the reference the indexes belong to
 * @param searchResults - The search results to be returned from the mocked API call
 * @returns The nock scope for the mocked API call
 */
export function mockApiFindIndexes(
	refId: string,
	_page: number,
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

/**
 * Creates a mocked API call for building an index for a reference
 *
 * @param refId - The id of the reference to build an index for
 * @returns The nock scope for the mocked API call
 */
export function mockApiBuildIndexes(refId: string) {
	return nock("http://localhost").post(`/api/refs/${refId}/indexes`).reply(201);
}
