import type { AnalysisMinimal } from "@analyses/types";
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

/**
 * Creates a mocked API call for creating an analysis on a sample
 *
 * @param analysis - The analysis returned by the request
 * @returns The nock scope for the mocked API call
 */
export function mockApiCreateAnalysis(analysis: AnalysisMinimal) {
	return nock("http://localhost")
		.post(`/api/samples/${analysis.sample.id}/analyses`)
		.reply(201, analysis);
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
