import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
	type CacheParams,
	createIndexArtifact,
	createWorkflowCache,
	deriveCacheKey,
	type IndexOtu,
	type RunSubprocess,
	type RunSubprocessOptions,
} from "@virtool/workflow";
import {
	createFakeContext,
	createFakeJobsApiClient,
	createFakeSubprocessRunner,
	createJobsApiState,
	createTestStorage,
	createTestWorkPath,
} from "@virtool/workflow/testing";
import { describe, expect, it, onTestFinished } from "vitest";
import {
	buildMappingIndexCacheParams,
	REFERENCE_INDEX_EXTRA_PARAMS,
} from "../cacheParams";
import type { PathoscopeData } from "../context";
import { workPaths } from "../paths";
import type { PathoscopeState } from "../state";
import { APP_VERSION } from "../version";
import { createReferenceIndexStep } from "./createIndexes";

const BOWTIE2_BUILD = "bowtie2-build";
const BOWTIE2_BUILD_VERSION = "2.4.4";
const INDEX_ID = 7;
const SHARD_NAME = "reference.1.bt2";

const OTU: IndexOtu = {
	abbreviation: "TMV",
	id: "otu_1",
	isolates: [
		{
			default: true,
			id: "isolate_default",
			sequences: [
				{
					accession: "AC_1",
					definition: "Default sequence",
					host: null,
					id: "seq_default",
					segment: null,
					sequence: "ACGTACGT",
				},
			],
			source_name: "A",
			source_type: "isolate",
		},
		{
			default: false,
			id: "isolate_other",
			sequences: [
				{
					accession: "AC_2",
					definition: "Other sequence",
					host: null,
					id: "seq_other",
					segment: null,
					sequence: "TTTT",
				},
			],
			source_name: "B",
			source_type: "isolate",
		},
	],
	name: "Tobacco mosaic virus",
	schema: [],
	taxid: 12242,
	version: 3,
};

function referenceIndexCacheParams(): CacheParams {
	return buildMappingIndexCacheParams({
		extra: REFERENCE_INDEX_EXTRA_PARAMS,
		indexKind: "reference_mapping_index",
		parentId: INDEX_ID,
		toolVersion: BOWTIE2_BUILD_VERSION,
		workflowVersion: APP_VERSION,
	});
}

/**
 * The step over a real work path, a faked jobs API and a faked `bowtie2-build`.
 *
 * The fake tool records the FASTA it was handed **as it is called**: the file is
 * staged in a temporary directory the step removes on the way out, so its
 * absence afterwards says nothing.
 */
async function setup() {
	const { path: workPath, cleanup } = await createTestWorkPath();
	onTestFinished(cleanup);

	const paths = workPaths(workPath);
	const state = createJobsApiState();
	const client = createFakeJobsApiClient(state);
	const { storage } = createTestStorage();

	const runner = createFakeSubprocessRunner();

	runner.register([BOWTIE2_BUILD, "--version"], {
		stdout: [`${BOWTIE2_BUILD} version ${BOWTIE2_BUILD_VERSION}`],
	});

	const builtFastas: string[] = [];

	const runSubprocess: RunSubprocess = async (
		options: RunSubprocessOptions,
	) => {
		const [tool, flag, , fastaPath, indexPrefix] = options.command;

		if (tool === BOWTIE2_BUILD && flag !== "--version") {
			builtFastas.push(await readFile(fastaPath ?? "", "utf8"));

			// The shards the real tool writes, which the cache then archives.
			await mkdir(dirname(indexPrefix ?? ""), { recursive: true });
			await writeFile(`${indexPrefix}.1.bt2`, "built shard");
		}

		return runner(options);
	};

	const data: PathoscopeData = {
		analysisId: 1,
		index: { id: INDEX_ID, path: paths.sourceIndex(INDEX_ID) },
		readPaths: [],
		subtractions: [],
		pScoreCutoff: 0.01,
	};

	const pathoscopeState: PathoscopeState = {
		candidateSequenceIds: [],
		subtractedCount: 0,
	};

	return {
		builtFastas,
		paths,
		state,

		run() {
			return createReferenceIndexStep.run(
				createFakeContext(data, pathoscopeState, {
					client,
					runSubprocess,
					storage,
					workPath,
				}),
			);
		},

		/** Write a collapsed reference for the step to read default isolates from. */
		async writeCollapsedReference() {
			await mkdir(dirname(paths.collapsedReference), { recursive: true });

			await createIndexArtifact(paths.collapsedReference, null, [OTU]);
		},

		/**
		 * Register a built index under the key this run derives.
		 *
		 * Archived from outside the work path, so restoring it lands the shard
		 * where `bowtie2-build` would have written one.
		 */
		async seedCachedIndex() {
			const source = await mkdtemp(join(tmpdir(), "pathoscope-cache-"));
			onTestFinished(() => rm(source, { force: true, recursive: true }));

			const directory = join(source, "reference_index");

			await mkdir(directory);
			await writeFile(join(directory, SHARD_NAME), "cached shard");

			const params = referenceIndexCacheParams();

			await createWorkflowCache({
				client,
				storage,
				stagingPath: join(source, "staging"),
			}).put(deriveCacheKey(params), directory, params);

			state.cacheRegistrations.length = 0;
		},
	};
}

describe("createReferenceIndexStep", () => {
	it("writes the reference fasta and caches the index on a miss", async () => {
		const { builtFastas, paths, run, state, writeCollapsedReference } =
			await setup();

		await writeCollapsedReference();

		await run();

		expect(builtFastas).toEqual([">seq_default\nACGTACGT\n"]);

		expect(state.cacheRegistrations.map(({ key }) => key)).toEqual([
			deriveCacheKey(referenceIndexCacheParams()),
		]);

		await expect(
			readFile(`${paths.referenceIndexPrefix}.1.bt2`, "utf8"),
		).resolves.toBe("built shard");
	});

	// The collapsed reference is deliberately absent: assembling the FASTA has to
	// open it, and `openWorkflowIndex` throws on a missing artifact. So a run that
	// restores the index cannot have scanned the reference to write a file it
	// then deletes unread.
	it("writes no reference fasta on a cache hit", async () => {
		const { builtFastas, paths, run, seedCachedIndex, state } = await setup();

		await seedCachedIndex();

		await run();

		expect(builtFastas).toEqual([]);
		expect(state.cacheRegistrations).toEqual([]);

		await expect(
			readFile(join(dirname(paths.referenceIndexPrefix), SHARD_NAME), "utf8"),
		).resolves.toBe("cached shard");
	});
});
