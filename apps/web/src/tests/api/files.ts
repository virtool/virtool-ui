import type { Upload } from "@uploads/types";
import nock from "nock";

/**
 * Creates a mocked API call for getting a paginated list of uploads.
 *
 * @param files - The uploads to be returned from the mocked API call
 * @param query - Whether to include query parameters in the request
 * @returns The nock scope for the mocked API call
 */
export function mockApiListFiles(files: Upload[], query?: boolean) {
	return nock("http://localhost")
		.get("/api/uploads")
		.query(query || true)
		.reply(200, {
			found_count: files.length,
			page: 1,
			page_count: 1,
			per_page: 25,
			total_count: files.length,
			items: files,
		});
}

/**
 * Creates a mocked API call for deleting a file.
 *
 * @param fileId - The id of the file that is expected to be deleted
 * @returns The nock scope for the mocked API call
 */
export function mockApiDeleteFile(fileId: number) {
	return nock("http://localhost").delete(`/api/uploads/${fileId}`).reply(200);
}
