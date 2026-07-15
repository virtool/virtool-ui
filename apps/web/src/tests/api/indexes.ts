import type { IndexMinimal } from "@indexes/types";
import nock from "nock";

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
