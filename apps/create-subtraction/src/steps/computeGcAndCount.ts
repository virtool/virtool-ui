import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { computeComposition } from "../composition";
import type { CreateSubtractionStep } from "./types";

/**
 * Count the genome's sequences and nucleotides.
 *
 * **Python's extension check is deliberately not ported.** `workflow.py` reads
 * `if not path.suffix != "fa": raise ValueError(...)`, and `Path.suffix` returns
 * `".fa"` with the leading dot — so `path.suffix != "fa"` is always true, `not`
 * of it is always false, and the branch cannot fire. This step accepts any input
 * path and never raises on the extension, which is what Python does. Writing the
 * check the way it was evidently intended would reject inputs nothing rejects
 * today; if a real one is wanted it is its own change, with its own review.
 */
export const computeGcAndCountStep: CreateSubtractionStep = {
	id: "compute_gc_and_count",
	description:
		"Compute the genome's nucleotide composition and sequence count.",
	async run({ data, logger, state }) {
		const { count, gc } = await computeComposition(
			createInterface({
				input: createReadStream(data.paths.fasta),
				crlfDelay: Number.POSITIVE_INFINITY,
			}),
		);

		state.count = count;
		state.gc = gc;

		logger.info({ count, gc }, "computed nucleotide composition");
	},
};
