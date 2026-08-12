import { computeComposition } from "../composition";
import { readLines } from "../lines";
import type { CreateSubtractionStep } from "./types";

/**
 * Count the genome's sequences and nucleotides.
 *
 * Reads the upload where it lies, gunzipping through a stream rather than
 * writing a plain FASTA first. Python reaches the same property by handing the
 * compressed file to `seqkit`, which decompresses internally.
 */
export const computeGcAndCountStep: CreateSubtractionStep = {
	id: "compute_gc_and_count",
	description:
		"Compute the genome's nucleotide composition and sequence count.",
	async run({ data, logger, state }) {
		const { count, gc } = await computeComposition(
			readLines(data.paths.upload, { gzipped: data.uploadIsGzipped }),
		);

		state.count = count;
		state.gc = gc;

		logger.info({ count, gc }, "computed nucleotide composition");
	},
};
