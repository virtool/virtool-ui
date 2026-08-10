import type { JobState } from "@virtool/contracts";

/**
 * Derive a user-friendly FASTA filename from a subtraction name
 * (e.g. "Arabidopsis thaliana" -> "arabidopsis_thaliana.fa.gz").
 */
export function getSubtractionFastaName(name: string) {
	return `${name.toLowerCase().replace(/\s+/g, "_")}.fa.gz`;
}

/**
 * Whether a job reached a terminal state without producing anything.
 *
 * A subtraction whose create job ends this way is stuck at `ready: false` with
 * no files, and nothing will ever finish it. The detail view has to offer
 * deletion in that state, or the row is unreachable for the rest of its life.
 */
export function isJobStateUnsuccessful(state?: JobState | null): boolean {
	return state === "cancelled" || state === "failed";
}
