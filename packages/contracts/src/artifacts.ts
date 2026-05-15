import { z } from "zod";

/** Pinned set of artifact upload formats accepted by `POST /analyses/{id}/files/{format}`. Source of truth shared with the API server. */
export const ArtifactFormat = z.enum([
	"assembly.fa.gz",
	"orfs.fa.gz",
	"report.tsv",
	"hmm.tsv",
]);

export type ArtifactFormat = z.infer<typeof ArtifactFormat>;
