/**
 * Building a pathoscope run's context.
 *
 * Everything a step needs is resolved once, here, before step 1: the metadata
 * reads against the jobs API and the three downloads that follow from them. That
 * is the eager model — Python resolved fixtures lazily by parameter name, so a
 * storage failure surfaced forty minutes into a run at whichever step first
 * touched the file. Here it surfaces before any work is done.
 *
 * Every value below survives a JSON round trip. `createWorkflowContext` asserts
 * that on every run, so nothing here may be a handle, a closure, or a class
 * instance — the open SQLite handles are made per step, from the paths recorded
 * here.
 */

import { basename, join } from "node:path";
import {
	WorkflowAnalysis,
	WorkflowIndex,
	WorkflowSample,
	WorkflowSubtraction,
} from "@virtool/contracts";
import {
	type BuildContextInput,
	downloadToPath,
	INDEX_SQLITE_FILE_NAME,
} from "@virtool/workflow";
import { sourceIndexPath, subtractionFastaPath } from "./paths";

/**
 * The minimum alignment score an alignment must reach to be counted.
 *
 * Python's `p_score_cutoff` fixture, which nothing ever overrode.
 */
export const P_SCORE_CUTOFF = 0.01;

/** The one subtraction file pathoscope reads. */
const SUBTRACTION_FASTA_NAME = "subtraction.fa.gz";

/** A subtraction, reduced to what the run actually uses. */
export type PathoscopeSubtraction = {
	id: number;
	name: string;
	/** Where the gzipped source genome was downloaded to. */
	fastaPath: string;
};

/** The eagerly resolved data half of a pathoscope run's context. */
export type PathoscopeData = {
	/** The analysis this run finalizes */
	analysisId: number;

	/** The reference index the analysis is pinned to */
	index: { id: number; path: string };

	/** The sample's reads, in pair order */
	readPaths: string[];

	/** The subtractions to eliminate reads against, in the analysis's order */
	subtractions: PathoscopeSubtraction[];

	/** @see {@link P_SCORE_CUTOFF} */
	pScoreCutoff: number;
};

/**
 * Read a job argument that must be a positive integer.
 *
 * The blob is a JSONB column Python wrote, so nothing about it is typed on the
 * way in. A job pointing at no analysis cannot be run, and failing here names
 * the argument rather than producing a 404 from a metadata read.
 */
function readIdArg(args: Record<string, unknown>, name: string): number {
	const value = args[name];

	if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
		throw new Error(
			`Job argument ${name} must be a positive integer, got ${JSON.stringify(value)}`,
		);
	}

	return value;
}

export async function buildPathoscopeContext({
	client,
	job,
	logger,
	storage,
	workPath,
}: BuildContextInput): Promise<PathoscopeData> {
	const analysisId = readIdArg(job.args, "analysis_id");

	const analysis = await client.request({
		method: "GET",
		path: `/analyses/${analysisId}`,
		schema: WorkflowAnalysis,
	});

	// The sample, index and subtraction reads are independent of each other and
	// each is a round trip to a service in the same cluster.
	const [sample, index, subtractions] = await Promise.all([
		client.request({
			method: "GET",
			path: `/samples/${analysis.sample.id}`,
			schema: WorkflowSample,
		}),
		client.request({
			method: "GET",
			path: `/indexes/${analysis.index.id}`,
			schema: WorkflowIndex,
		}),
		Promise.all(
			analysis.subtractions.map((subtraction) =>
				client.request({
					method: "GET",
					path: `/subtractions/${subtraction.id}`,
					schema: WorkflowSubtraction,
				}),
			),
		),
	]);

	logger.info(
		{
			analysisId,
			indexId: index.id,
			sampleId: sample.id,
			subtractionCount: subtractions.length,
		},
		"resolved analysis metadata",
	);

	const readPaths = resolveReadPaths(sample, workPath);
	const indexPath = sourceIndexPath(workPath, index.id);

	await Promise.all([
		downloadReads(storage, sample, readPaths),
		downloadIndexArtifact(storage, index, indexPath),
		...subtractions.map((subtraction) =>
			downloadSubtractionFasta(
				storage,
				subtraction,
				subtractionFastaPath(workPath, subtraction.id),
			),
		),
	]);

	logger.info(
		{ readCount: readPaths.length, indexPath },
		"downloaded run inputs",
	);

	return {
		analysisId,
		index: { id: index.id, path: indexPath },
		readPaths,
		pScoreCutoff: P_SCORE_CUTOFF,
		subtractions: subtractions.map((subtraction) => ({
			id: subtraction.id,
			name: subtraction.name,
			fastaPath: subtractionFastaPath(workPath, subtraction.id),
		})),
	};
}

/**
 * Where each of the sample's read files lands, in pair order.
 *
 * Sorted by name rather than taken in the order the read arrived in: the two
 * files are `reads_1.fq.gz` and `reads_2.fq.gz`, the pairing is by position, and
 * handing bowtie2 the pair the wrong way round is not something it reports.
 */
function resolveReadPaths(sample: WorkflowSample, workPath: string): string[] {
	return sample.reads
		.map((read) => read.name)
		.sort()
		.map((name) => join(workPath, "reads", name));
}

async function downloadReads(
	storage: BuildContextInput["storage"],
	sample: WorkflowSample,
	readPaths: readonly string[],
): Promise<void> {
	const byName = new Map(sample.reads.map((read) => [read.name, read]));

	await Promise.all(
		readPaths.map((path) => {
			const name = basename(path);
			const read = byName.get(name);

			// Nullable wherever its column is, and there is no fallback that finds
			// the object — nothing composes a key from row identity on either side.
			if (!read?.storageKey) {
				throw new Error(
					`Sample ${sample.id} read ${name} records no storage key`,
				);
			}

			return downloadToPath(storage, read.storageKey, path);
		}),
	);
}

/**
 * Download the index's SQLite artifact.
 *
 * There is no fallback to the JSON forms Python still reads. A 200–500 MB
 * reference document exceeds V8's maximum string length, so `JSON.parse` cannot
 * open one at all — an index without a SQLite artifact is not analysable here
 * and must say so rather than degrade.
 */
async function downloadIndexArtifact(
	storage: BuildContextInput["storage"],
	index: WorkflowIndex,
	path: string,
): Promise<void> {
	const file = index.files.find(({ name }) => name === INDEX_SQLITE_FILE_NAME);

	if (!file) {
		throw new Error(
			`Index ${index.id} has no ${INDEX_SQLITE_FILE_NAME}; rebuild it before analysing against it`,
		);
	}

	await downloadToPath(storage, file.storageKey, path);
}

/**
 * Download a subtraction's gzipped source genome, and only that.
 *
 * Python downloads every file a subtraction has, including the six bowtie2
 * shards. Pathoscope reads none of them — `create_subtraction_index` builds its
 * own index from this FASTA — so they are six large downloads for nothing. A
 * subtraction finalized by the TypeScript `create_subtraction` workflow has no
 * shards to download in any case.
 */
async function downloadSubtractionFasta(
	storage: BuildContextInput["storage"],
	subtraction: WorkflowSubtraction,
	path: string,
): Promise<void> {
	const file = subtraction.files.find(
		({ name }) => name === SUBTRACTION_FASTA_NAME,
	);

	if (!file?.storageKey) {
		throw new Error(
			`Subtraction ${subtraction.id} records no ${SUBTRACTION_FASTA_NAME} storage key`,
		);
	}

	await downloadToPath(storage, file.storageKey, path);
}
