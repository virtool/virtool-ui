import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { openWorkflowIndex, writeFasta } from "@virtool/workflow";
import { buildBowtie2Index } from "../mappingIndex";
import { findCandidateSequenceIds } from "../pathoscopeCore";
import {
	collapsedReferencePath,
	isolateBamPath,
	isolateFastaPath,
	isolateFastqPath,
	isolateIndexPrefix,
	isolatesDir,
	referenceIndexPrefix,
} from "../paths";
import type { PathoscopeStep } from "./types";

/**
 * Find the OTUs the sample's reads could plausibly belong to.
 *
 * `pathoscope-core` drives bowtie2 itself here and streams the SAM as it comes,
 * so a full alignment against every default isolate never lands on disk and
 * never enters this process.
 */
export const mapDefaultIsolatesStep: PathoscopeStep = {
	id: "map_default_isolates",
	description:
		"Map sample reads to all default isolates to identify candidate OTUs.",
	async run({ data, logger, proc, runSubprocess, state, workPath }) {
		state.candidateSequenceIds = await findCandidateSequenceIds(
			{ runSubprocess, outputPath: join(workPath, "candidates.json") },
			{
				indexPrefix: referenceIndexPrefix(workPath),
				pScoreCutoff: data.pScoreCutoff,
				proc,
				readPaths: data.readPaths,
			},
		);

		logger.info(
			{ count: state.candidateSequenceIds.length },
			"found candidate sequences",
		);
	},
};

/**
 * Build a second index holding **every** isolate of every candidate OTU.
 *
 * The first pass narrowed the reference to a handful of OTUs; this one restores
 * the isolate-level detail for just those, which is what makes an isolate-level
 * result affordable.
 */
export const buildIsolateIndexStep: PathoscopeStep = {
	id: "build_isolate_index",
	description:
		"Build a mapping index containing all isolates of candidate OTUs.",
	async run({ data, logger, proc, runSubprocess, state, workPath }) {
		// `bowtie2-build` exits 1 on an empty FASTA, and every step after this one
		// short-circuits on the same condition.
		if (state.candidateSequenceIds.length === 0) {
			logger.info("no candidate otus; skipping isolate index");

			return;
		}

		const index = openWorkflowIndex({
			id: data.index.id,
			path: collapsedReferencePath(workPath),
		});

		try {
			const otuRefs = await index.getOtuRefsBySequenceIds(
				state.candidateSequenceIds,
			);

			const otuIds = new Set(Object.values(otuRefs).map((otuRef) => otuRef.id));

			await mkdir(isolatesDir(workPath), { recursive: true });

			await writeFasta(
				isolateFastaPath(workPath),
				index.iterOtuSequences(otuIds),
			);

			logger.info({ otuCount: otuIds.size }, "wrote isolate fasta");
		} finally {
			index.close();
		}

		await buildBowtie2Index(
			runSubprocess,
			isolateFastaPath(workPath),
			isolateIndexPrefix(workPath),
			proc,
		);
	},
};

/**
 * Align the sample against the isolate index.
 *
 * Run as a shell pipeline so the SAM stream goes straight into `samtools` and is
 * never written out. The runtime's runner never takes a shell string, so
 * `bash -c` is explicit here; every path in the command is composed from the
 * work path and an integer id.
 *
 * `-k 100` keeps up to a hundred alignments per read, which is the point — the
 * multi-mapping reads are exactly what expectation maximization later reassigns.
 */
export const mapIsolatesStep: PathoscopeStep = {
	id: "map_isolates",
	description: "Map sample reads to the all isolate index.",
	async run({ data, logger, proc, runSubprocess, state, workPath }) {
		if (state.candidateSequenceIds.length === 0) {
			logger.info("no candidate otus; skipping isolate mapping");

			return;
		}

		// Comma-joined, unlike the repeated `--reads` the candidate search takes.
		// `bowtie2 -U` reads one comma-separated list.
		const reads = data.readPaths.join(",");

		const bowtie2 = [
			"bowtie2",
			`-p ${proc}`,
			"--no-unal",
			"--local",
			"--score-min L,20,1.0",
			"-N 0",
			"-L 15",
			"-k 100",
			`--al ${isolateFastqPath(workPath)}`,
			`-x ${isolateIndexPrefix(workPath)}`,
			`-U ${reads}`,
		].join(" ");

		const samtools = `samtools view -bS - -o ${isolateBamPath(workPath)}`;

		await runSubprocess({
			command: ["bash", "-c", `${bowtie2} | ${samtools}`],
		});

		logger.info({ path: isolateBamPath(workPath) }, "mapped reads to isolates");
	},
};
