import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Logger } from "@virtool/logger";
import {
	createIndexArtifact,
	deriveCacheKey,
	openWorkflowIndex,
	type RunSubprocess,
} from "@virtool/workflow";
import { cacheFor } from "../cache";
import {
	buildCollapsedReferenceCacheParams,
	getCdHitEstVersion,
} from "../cacheParams";
import { collapsedReferenceDir, collapsedReferencePath } from "../paths";
import {
	type CollapseSegment,
	collapseOtus,
	createCollapseSummary,
	createSegmentCollapser,
	createSemaphore,
	type ReferenceCollapseSummary,
} from "../reference/collapse";
import { APP_VERSION } from "../version";
import type { PathoscopeStep } from "./types";

/**
 * Collapse redundant isolates out of the reference and write the survivors as a
 * second index artifact.
 *
 * Cache-aware, on a namespace **forked** from Python's — the artifact is a
 * SQLite file this code writes, so a Python-written one is not interchangeable
 * with it. See `cacheParams.ts`.
 */
export const collapseReferenceStep: PathoscopeStep = {
	id: "collapse_reference",
	description: "Ensure a cd-hit-est collapsed reference index exists locally.",
	async run(context) {
		const { data, logger, proc, runSubprocess, workPath } = context;
		const cache = cacheFor(context);

		const params = buildCollapsedReferenceCacheParams({
			indexId: data.index.id,
			toolVersion: await getCdHitEstVersion(runSubprocess),
			workflowVersion: APP_VERSION,
		});

		const key = deriveCacheKey(params);
		const targetDir = collapsedReferenceDir(workPath);
		const log = logger.child({ key, indexId: data.index.id });

		// Restored into the work path, so the archive's one top-level entry
		// recreates `collapsed_reference/` itself.
		if (await cache.get(key, dirname(targetDir))) {
			log.info("restored cached collapsed reference");

			return;
		}

		log.info("collapsing reference");

		const summary = await collapseReference({
			index: data.index,
			logger: log,
			proc,
			runSubprocess,
			workPath,
		});

		log.info(summary, "reference collapse complete");

		// An already-registered key is success: another run can have collapsed
		// the same reference while this one was working.
		const created = await cache.put(key, targetDir, params);

		log.info({ created }, "cached collapsed reference");
	},
};

async function collapseReference({
	index,
	logger,
	proc,
	runSubprocess,
	workPath,
}: {
	index: { id: number; path: string };
	logger: Logger;
	proc: number;
	runSubprocess: RunSubprocess;
	workPath: string;
}): Promise<ReferenceCollapseSummary> {
	const source = openWorkflowIndex({ id: index.id, path: index.path });

	// Staged outside `collapsed_reference/`, which is archived into the cache
	// whole — a scratch directory inside it would be cached along with it.
	const temp = await mkdtemp(join(workPath, "collapse-"));

	try {
		await mkdir(collapsedReferenceDir(workPath), { recursive: true });

		// **Read before collapsing, and deliberately not caught.** Python wrapped
		// this in a `try/except ValueError` that substituted `None`, so an index
		// missing its metadata produced a collapsed reference with no reference
		// attached and the run finished normally — a degraded result nobody could
		// tell was degraded. Here it fails the step.
		const reference = await source.getReferenceMetadata();

		const summary = createCollapseSummary();

		// `collapseOtus` is a generator and `createIndexArtifact` consumes it
		// lazily, so the collapsed reference is never held in memory whole.
		await createIndexArtifact(
			collapsedReferencePath(workPath),
			reference,
			collapseOtus(
				source,
				temp,
				// One cd-hit-est per segment, each given `-T 1`, so the parallelism
				// is the semaphore's rather than the tool's.
				withSemaphore(
					createSemaphore(proc),
					createSegmentCollapser(runSubprocess),
				),
				summary,
			),
		);

		logger.info(
			{ path: collapsedReferencePath(workPath) },
			"wrote collapsed index",
		);

		return summary;
	} finally {
		await rm(temp, { force: true, recursive: true });

		source.close();
	}
}

/** Bound how many `cd-hit-est` runs are in flight across every OTU. */
function withSemaphore(
	acquire: <T>(run: () => Promise<T>) => Promise<T>,
	collapseSegment: CollapseSegment,
): CollapseSegment {
	return (inputPath, outputPath, sequences) =>
		acquire(() => collapseSegment(inputPath, outputPath, sequences));
}
