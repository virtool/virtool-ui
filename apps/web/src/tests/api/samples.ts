import { faker } from "@faker-js/faker";
import type {
	LibraryType,
	Sample,
	SampleMinimal,
	SampleRightsUpdate,
} from "@samples/types";
import nock from "nock";
import { createFakeSample } from "../fake/samples";
import { createFakeSubtractionNested } from "../fake/subtractions";

/**
 * Creates a mocked API call for getting a paginated list of samples
 *
 * @param samples - The sample documents
 * @param counts - Overrides for the counts, which otherwise both match the
 *   number of documents. ``total_count`` is every sample the user may see and
 *   ``found_count`` is only those matching the filters.
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSamples(
	samples: SampleMinimal[],
	counts: { found_count?: number; total_count?: number } = {},
) {
	return nock("http://localhost")
		.get("/api/samples")
		.query(true)
		.reply(200, {
			page: 1,
			page_count: 1,
			per_page: 5,
			total_count: counts.total_count ?? samples.length,
			found_count: counts.found_count ?? samples.length,
			documents: samples,
		});
}

/**
 * Sets up a mocked API route for fetching a single sample
 *
 * @param sampleDetail - The sample detail to be returned from the mocked API call
 * @param statusCode - The HTTP status code to simulate in the response
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSampleDetail(
	sampleDetail: Sample,
	statusCode?: number,
) {
	return nock("http://localhost")
		.get(`/api/samples/${sampleDetail.id}`)
		.query(true)
		.reply(statusCode || 200, sampleDetail);
}

/**
 * Sets up a mocked API route for updating the sample details
 *
 * @param sample - The sample details
 * @param name - The updated name
 * @param isolate - The updated isolate
 * @param host - The updated host
 * @param locale - The updated locale
 * @param notes - The updated notes
 * @returns A nock scope for the mocked API call
 */
export function mockApiEditSample(
	sample: Sample,
	name: string,
	isolate: string,
	host: string,
	locale: string,
	notes: string,
) {
	const sampleDetail = { ...sample, name, isolate, host, locale, notes };

	return nock("http://localhost")
		.patch(`/api/samples/${sample.id}`)
		.reply(200, sampleDetail);
}

/**
 * Sets up a mocked API route for updating a samples rights
 *
 * @param sample - The sample details
 * @param update - The update to be applied
 * @returns A nock scope for the mocked API call
 */
export function mockApiUpdateSampleRights(
	sample: Sample,
	update: SampleRightsUpdate,
) {
	const sampleRightsUpdate = {
		all_read: faker.datatype.boolean(),
		all_write: faker.datatype.boolean(),
		group: null,
		group_read: faker.datatype.boolean(),
		group_write: faker.datatype.boolean(),
		user: { id: sample.user.id },
		...update,
	};

	return nock("http://localhost")
		.patch(`/api/samples/${sample.id}/rights`)
		.reply(200, sampleRightsUpdate);
}

/**
 * Creates a mocked API call for creating a sample
 *
 * @param name - The name of the sample
 * @param isolate - The sample isolate
 * @param host - The sample host
 * @param locale - The locale of the sample
 * @param library_type - The library type of the sample
 * @param files - The sample uploads used to create the sample
 * @param labels - The labels associated with the sample
 * @param subtractions - The subtractions associated with the sample
 * @param group - The group associated with the sample
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateSample(
	name: string,
	isolate: string,
	host: string,
	locale: string,
	library_type: LibraryType,
	files: number[],
	labels: number[],
	subtractions: string[],
	group: string | null,
) {
	const sample = createFakeSample({
		name,
		isolate,
		host,
		locale,
		library_type,
		subtractions: [createFakeSubtractionNested({ id: subtractions[0] })],
	});

	return nock("http://localhost")
		.post("/api/samples", {
			name,
			isolate,
			host,
			locale,
			library_type,
			files,
			labels,
			subtractions,
			group,
		})
		.reply(201, sample);
}

/**
 * Creates a mocked API call that rejects the creation of a sample
 *
 * @param name - The name of the sample to reject
 * @param message - The reason the API gives for rejecting it
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateSampleFailure(name: string, message: string) {
	return nock("http://localhost")
		.post("/api/samples", (body) => body.name === name)
		.reply(400, { message });
}

/**
 * Creates a mocked API call for removing a sample
 *
 * @param sampleId - The id of the sample being removed
 * @returns The nock scope for the mocked API call
 */
export function mockApiRemoveSample(sampleId: string) {
	return nock("http://localhost").delete(`/api/samples/${sampleId}`).reply(200);
}
