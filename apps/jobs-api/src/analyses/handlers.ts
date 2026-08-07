import type { Analysis, WorkflowAnalysis } from "@virtool/contracts";
import { FinalizeAnalysisRequest } from "@virtool/contracts";
import {
	AnalysisAlreadyFinalizedError,
	AnalysisNotFoundError,
	AnalysisNotOwnedError,
	finalizeAnalysis,
	getAnalysis,
} from "@virtool/data/analyses/data";
import type { Db } from "@virtool/data/db/pg";
import type { Logger } from "@virtool/logger";
import type { StorageBackend } from "@virtool/storage";
import { requireJobRequest } from "../auth/guard";
import {
	jsonError,
	parseJsonBody,
	type ReadHandlerDeps,
	requireRowId,
} from "../http";
import { checkManifest, measureManifest } from "../manifest";

/** What the analysis handlers need to serve a request. */
export type AnalysisHandlerDeps = {
	db: Db;
	storage: StorageBackend;
	logger: Logger;
};

/**
 * Narrow an analysis to what a workflow reads.
 *
 * `sample` stays an object carrying an id. Python's runtime falls back to
 * reading it when a job's `args` carry no `sample_id`, so flattening it to a
 * bare id breaks every analysis whose job was created without one.
 *
 * The results blob and the file rows are both dropped. A workflow reading an
 * analysis is about to produce them, and `getAnalysis` deliberately does not
 * read `results` — that is `getAnalysisResults`, which runs the history-patching
 * format step this read must never pay for.
 */
function toWorkflowAnalysis(analysis: Analysis): WorkflowAnalysis {
	return {
		id: analysis.id,
		index: { id: analysis.index.id, version: analysis.index.version },
		ready: analysis.ready,
		reference: {
			id: analysis.reference.id,
			name: analysis.reference.name,
		},
		sample: { id: analysis.sample.id, name: analysis.sample.name },
		subtractions: analysis.subtractions.map((subtraction) => ({
			id: subtraction.id,
			name: subtraction.name,
		})),
		workflow: analysis.workflow,
	};
}

/**
 * Serve the analysis a workflow is running: the index and reference it is
 * pinned to, the sample it came from, and the subtractions it must apply.
 *
 * Records only, and no results — see {@link toWorkflowAnalysis}.
 */
export async function handleGetAnalysis(
	deps: ReadHandlerDeps,
	request: Request,
	analysisIdParam: string,
): Promise<Response> {
	const principal = await requireJobRequest(deps.db, request);

	if (principal instanceof Response) {
		return principal;
	}

	const analysisId = requireRowId(analysisIdParam, "Analysis not found");

	if (analysisId instanceof Response) {
		return analysisId;
	}

	try {
		return Response.json(
			toWorkflowAnalysis(await getAnalysis(deps.db, analysisId)),
		);
	} catch (err) {
		if (err instanceof AnalysisNotFoundError) {
			return jsonError(404, "Analysis not found");
		}

		throw err;
	}
}

/**
 * Finalize an analysis: record its results blob and the files the workflow
 * retained, and flip it ready.
 *
 * Unlike a subtraction or a sample, the filenames here are the workflow's to
 * choose — a NuVs run names its own FASTA and HMM outputs — so they are checked
 * for shape rather than against a whitelist. The download route addresses these
 * by row id, not by name.
 *
 * A job may only finalize the analysis it was started for. That check is the
 * resource counterpart of `requireOwnJob` on the lifecycle routes, and answers
 * the same 403 — but it is `analyses.job_id` that decides it, so it happens
 * inside the same statement that writes, not in a guard here.
 */
export async function handleFinalizeAnalysis(
	deps: AnalysisHandlerDeps,
	request: Request,
	analysisIdParam: string,
): Promise<Response> {
	const principal = await requireJobRequest(deps.db, request);

	if (principal instanceof Response) {
		return principal;
	}

	const analysisId = requireRowId(analysisIdParam, "Analysis not found");

	if (analysisId instanceof Response) {
		return analysisId;
	}

	const parsed = await parseJsonBody(request, FinalizeAnalysisRequest);

	if (parsed instanceof Response) {
		return parsed;
	}

	const { results, files } = parsed;

	const invalid = checkManifest(files, `analyses/${analysisId}/`, null);

	if (invalid) {
		return jsonError(400, invalid);
	}

	const measured = await measureManifest(deps.storage, files);

	if (measured === null) {
		return jsonError(400, "A manifest entry names no stored object");
	}

	try {
		const analysis = await finalizeAnalysis(
			deps.db,
			analysisId,
			principal.jobId,
			{
				results,
				files: measured.map((file) => ({
					name: file.name,
					format: file.format,
					description: file.description,
					size: file.size,
					storageKey: file.storageKey,
				})),
			},
		);

		deps.logger.info(
			{ jobId: principal.jobId, analysisId, files: files.length },
			"finalized analysis",
		);

		return Response.json(analysis);
	} catch (err) {
		if (err instanceof AnalysisNotFoundError) {
			return jsonError(404, "Analysis not found");
		}

		if (err instanceof AnalysisNotOwnedError) {
			return jsonError(403, "Job was not started for this analysis");
		}

		if (err instanceof AnalysisAlreadyFinalizedError) {
			return jsonError(409, "Analysis has already been finalized");
		}

		throw err;
	}
}
