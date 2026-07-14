import type { Analysis, AnalysisMinimal } from "@analyses/types";
import nock from "nock";

/**
 * Creates a mocked API call for getting a paginated list of analyses
 *
 * @param analyses - The analysis documents
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetAnalyses(analyses: AnalysisMinimal[]) {
	const [firstAnalysis] = analyses;
	if (!firstAnalysis) {
		throw new Error("expected at least one analysis");
	}
	return nock("http://localhost")
		.get(`/api/samples/${firstAnalysis.sample.id}/analyses`)
		.query(true)
		.reply(200, {
			page: 1,
			page_count: 1,
			per_page: 25,
			total_count: analyses.length,
			found_count: analyses.length,
			documents: analyses,
		});
}

type CreateAnalysisRequestBody = {
	ml?: string;
	ref_id: string;
	subtractions?: string[];
	workflow: string;
};

/**
 * Creates a mocked API call for getting an analysis
 *
 * @param sampleId - The unique identifier of the sample being analysed
 * @param requestBody - The request body for creating an analysis
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateAnalysis(
	sampleId: string,
	requestBody: CreateAnalysisRequestBody,
) {
	return nock("http://localhost")
		.post(
			`/api/samples/${sampleId}/anal
        yses`,
			requestBody,
		)
		.reply(201);
}

/**
 * Creates a mocked API call for getting a single analysis
 *
 * @param analysis - The analysis document
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetAnalysis(analysis: Analysis) {
	return nock("http://localhost")
		.get(`/api/analyses/${analysis.id}`)
		.reply(200, analysis);
}

/**
 * Creates a mocked API call for initiating a blast for a Nuvs sequence
 *
 * @param analysisId - The id of the analysis associated with the sequence
 * @param sequenceIndex - The index of the sequence the blast is initiating for
 * @returns The nock scope for the mocked API call
 */
export function mockApiBlastNuVs(analysisId: string, sequenceIndex: string) {
	return nock("http://localhost")
		.put(`/api/analyses/${analysisId}/${sequenceIndex}/blast`)
		.reply(200);
}
