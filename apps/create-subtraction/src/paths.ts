/**
 * Every path this workflow reads or writes under its work path.
 *
 * The layout is Python's, so a run can be diffed against a Python run in the
 * same tree. The one thing that matters beyond that: **the input and the output
 * `subtraction.fa.gz` are different paths** — the upload is downloaded under
 * `subtractions/{id}/` and the recompressed genome is written at the work-path
 * root. Collapsing them would have `finalize` overwrite the file it read.
 */

import { join } from "node:path";

/** Every path one create_subtraction run uses. */
export type CreateSubtractionPaths = {
	/** The upload, as downloaded. Gzipped or not — it is whatever the user sent. */
	upload: string;

	/** The decompressed working genome, which `compute_gc_and_count` scans. */
	fasta: string;

	/** The recompressed genome, which is the run's only output. */
	compressedFasta: string;
};

export function workPaths(
	workPath: string,
	subtractionId: number,
): CreateSubtractionPaths {
	return {
		upload: join(
			workPath,
			"subtractions",
			String(subtractionId),
			"subtraction.fa.gz",
		),
		fasta: join(workPath, "subtraction.fa"),
		compressedFasta: join(workPath, "subtraction.fa.gz"),
	};
}
