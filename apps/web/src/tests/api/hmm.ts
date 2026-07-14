import type { Hmm, ServerHmmSearchResults } from "@hmm/types";
import nock from "nock";

/**
 * Sets up a mocked API route for fetching a list of HMMs
 *
 * @param hmmSearchResults - The hmm search results to be returned from the mocked API call
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetHmms(hmmSearchResults: ServerHmmSearchResults) {
	return nock("http://localhost")
		.get("/api/hmms")
		.query(true)
		.reply(200, hmmSearchResults);
}

/**
 * Sets up a mocked API route for fetching a single HMM
 *
 * @param hmmDetail - The hmm detail to be returned from the mocked API call
 * @param statusCode - The HTTP status code to simulate in the response
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetHmmDetail(hmmDetail: Hmm, statusCode?: number) {
	return nock("http://localhost")
		.get(`/api/hmms/${hmmDetail.id}`)
		.query(true)
		.reply(statusCode || 200, hmmDetail);
}
