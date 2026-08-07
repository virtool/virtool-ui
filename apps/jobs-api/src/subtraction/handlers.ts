import type { Subtraction, WorkflowSubtraction } from "@virtool/contracts";
import { FinalizeSubtractionRequest } from "@virtool/contracts";
import type { Db } from "@virtool/data/db/pg";
import {
	finalizeSubtraction,
	getSubtraction,
	SubtractionAlreadyFinalizedError,
	SubtractionNotFoundError,
	SubtractionNotOwnedError,
} from "@virtool/data/subtraction/data";
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

/** What the subtraction handlers need to serve a request. */
export type SubtractionHandlerDeps = {
	db: Db;
	storage: StorageBackend;
	logger: Logger;
};

/**
 * Narrow a subtraction to what a workflow reads.
 *
 * The mapping happens here rather than inside `@virtool/data`, which returns
 * this shape to `apps/web`'s client as well — including `createdAt` and
 * `linkedSamples`, which must not cross this wire, and `downloadUrl`, which
 * has no meaning to a workflow.
 *
 * Each file carries its recorded `storageKey`; the workflow takes it to the
 * bucket itself.
 */
function toWorkflowSubtraction(subtraction: Subtraction): WorkflowSubtraction {
	return {
		id: subtraction.id,
		count: subtraction.count,
		files: subtraction.files.map((file) => ({
			id: file.id,
			name: file.name,
			size: file.size,
			storageKey: file.storageKey,
			type: file.type,
		})),
		gc: subtraction.gc,
		name: subtraction.name,
		nickname: subtraction.nickname,
		ready: subtraction.ready,
	};
}

/**
 * Serve a subtraction's metadata and the files that make it up: its source
 * genome, plus the bowtie2 shards a subtraction finalized under Python still
 * carries. Those rows are served as they stand, `type` and all — only the write
 * path stopped accepting shards.
 *
 * Records only. Nothing here reads or writes an object.
 */
export async function handleGetSubtraction(
	deps: ReadHandlerDeps,
	request: Request,
	subtractionIdParam: string,
): Promise<Response> {
	const principal = await requireJobRequest(deps.db, request);

	if (principal instanceof Response) {
		return principal;
	}

	const subtractionId = requireRowId(
		subtractionIdParam,
		"Subtraction not found",
	);

	if (subtractionId instanceof Response) {
		return subtractionId;
	}

	try {
		return Response.json(
			toWorkflowSubtraction(await getSubtraction(deps.db, subtractionId)),
		);
	} catch (err) {
		if (err instanceof SubtractionNotFoundError) {
			return jsonError(404, "Subtraction not found");
		}

		throw err;
	}
}

/**
 * The only filename a subtraction accepts.
 *
 * Python's `virtool/subtractions/utils.py:FILES` names seven — the source FASTA
 * plus the six shards of a bowtie2 index — but **nothing consumes the shards**.
 * Both analysis workflows build a subtraction's bowtie2 index locally from the
 * `.fa.gz` and memoize it through their own workflow cache, so the shards are
 * written by one workflow and read by none. There is no parity constraint
 * either: this service has no per-file upload route, so Python's
 * `create_subtraction` cannot finalize against it at all, and
 * `apps/create-subtraction` is the only writer this route will ever have.
 *
 * This is the **write** path. Subtractions finalized under Python still carry
 * `bowtie2` rows and {@link handleGetSubtraction} keeps serving them.
 *
 * Python addresses a subtraction file by `name` in the URL of its download
 * endpoint, so this is what keeps that URL space closed. It is no longer doing
 * duty as key safety — the key is checked against the subtraction's own prefix.
 * With one name whitelisted, the duplicate check in `checkManifest` and the
 * non-empty manifest `FinalizeSubtractionRequest` requires, the FASTA arrives
 * exactly once.
 */
const FILE_NAMES = ["subtraction.fa.gz"] as const;

/**
 * Finalize a subtraction: record what the create_subtraction job produced and
 * flip it ready.
 *
 * Every object the manifest names is measured before any row is written, and the
 * rows carry those measurements rather than anything the caller declared.
 *
 * A job may only finalize the subtraction it produced. That check is the
 * resource counterpart of `requireOwnJob` on the lifecycle routes, and answers
 * the same 403 — but it is `subtractions.job_id` that decides it, so it happens
 * inside the same statement that writes, not in a guard here.
 */
export async function handleFinalizeSubtraction(
	deps: SubtractionHandlerDeps,
	request: Request,
	subtractionIdParam: string,
): Promise<Response> {
	const principal = await requireJobRequest(deps.db, request);

	if (principal instanceof Response) {
		return principal;
	}

	const subtractionId = requireRowId(
		subtractionIdParam,
		"Subtraction not found",
	);

	if (subtractionId instanceof Response) {
		return subtractionId;
	}

	const parsed = await parseJsonBody(request, FinalizeSubtractionRequest);

	if (parsed instanceof Response) {
		return parsed;
	}

	const { count, gc, files } = parsed;

	const invalid = checkManifest(
		files,
		`subtractions/${subtractionId}/`,
		FILE_NAMES,
	);

	if (invalid) {
		return jsonError(400, invalid);
	}

	const measured = await measureManifest(deps.storage, files);

	if (measured === null) {
		return jsonError(400, "A manifest entry names no stored object");
	}

	try {
		const subtraction = await finalizeSubtraction(
			deps.db,
			subtractionId,
			principal.jobId,
			{
				count,
				gc,
				files: measured.map((file) => ({
					name: file.name,
					// The whitelist admits the FASTA and nothing else, so there is no
					// type left to derive and no wire field with which to declare one.
					type: "fasta" as const,
					size: file.size,
					storageKey: file.storageKey,
				})),
			},
		);

		deps.logger.info(
			{ jobId: principal.jobId, subtractionId, files: files.length },
			"finalized subtraction",
		);

		return Response.json(subtraction);
	} catch (err) {
		if (err instanceof SubtractionNotFoundError) {
			return jsonError(404, "Subtraction not found");
		}

		if (err instanceof SubtractionNotOwnedError) {
			return jsonError(403, "Job did not produce this subtraction");
		}

		if (err instanceof SubtractionAlreadyFinalizedError) {
			return jsonError(409, "Subtraction has already been finalized");
		}

		throw err;
	}
}
