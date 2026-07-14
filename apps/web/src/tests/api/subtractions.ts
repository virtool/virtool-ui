import type {
	Subtraction,
	SubtractionMinimal,
	SubtractionOption,
} from "@subtraction/types";
import nock from "nock";

/**
 * Sets up a mocked API route for fetching a list of subtractions
 *
 * @param subtractions - The list of subtractions to be returned from the mocked API call
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSubtractions(subtractions: SubtractionMinimal[]) {
	return nock("http://localhost")
		.get("/api/subtractions")
		.query(true)
		.reply(200, {
			documents: subtractions,
			found_count: subtractions.length,
			page: 1,
			page_count: 1,
			per_page: 25,
			ready_count: subtractions.length,
			total_count: subtractions.length,
		});
}

/**
 * Sets up a mocked API route for fetching a single subtraction
 *
 * @param subtractionDetail - The subtraction detail to be returned from the mocked API call
 * @param statusCode - The HTTP status code to simulate in the response
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSubtractionDetail(
	subtractionDetail: Subtraction,
	statusCode?: number,
) {
	return nock("http://localhost")
		.get(`/api/subtractions/${subtractionDetail.id}`)
		.query(true)
		.reply(statusCode || 200, subtractionDetail);
}

/**
 * Sets up a mocked API route for updating the subtraction details
 *
 * @param subtraction - The subtraction details
 * @param name - The updated name
 * @param nickname - The updated nickname
 * @returns A nock scope for the mocked API call
 */
export function mockApiEditSubtraction(
	subtraction: Subtraction,
	name: string,
	nickname: string,
) {
	const subtractionDetail = { ...subtraction, name, nickname };

	return nock("http://localhost")
		.patch(`/api/subtractions/${subtraction.id}`)
		.reply(200, subtractionDetail);
}

/**
 * Sets up a mocked API route for creating a new subtraction
 *
 * @param name - The updated name
 * @param nickname - The updated nickname
 * @param uploadId - the unique identifier of the file to be used for the subtraction
 * @returns A nock scope for the mocked API call
 */
export function mockApiCreateSubtraction(
	name: string,
	nickname: string,
	uploadId: number,
) {
	return nock("http://localhost")
		.post("/api/subtractions", { name, nickname, upload_id: uploadId })
		.reply(200, { name, nickname, id: "subtraction_id" });
}

/**
 * Sets up a mocked API route for deleting a subtraction
 *
 * @param subtractionId - The subtraction to be removed
 * @returns A nock scope for the mocked API call
 */
export function mockApiRemoveSubtraction(subtractionId: string) {
	return nock("http://localhost")
		.delete(`/api/subtractions/${subtractionId}`)
		.reply(200);
}

/**
 * Sets up a mocked API route for fetching a subtraction shortlist
 *
 * @param subtractionsShortlist - The list of subtractions to be returned from the mocked API call
 * @param ready - Indicates whether to show all the ready subtractions
 * @returns A nock scope for the mocked API call
 */
export function mockApiGetShortlistSubtractions(
	subtractionsShortlist: SubtractionOption[],
	ready?: boolean,
) {
	return nock("http://localhost")
		.get("/api/subtractions")
		.query(ready ? { short: true, ready } : true)
		.reply(200, subtractionsShortlist);
}
