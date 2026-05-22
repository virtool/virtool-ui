import { z } from "zod";

/** Library type used by sample-trimming heuristics; mirrors the Python `LibraryType` enum. */
export const LibraryType = z.enum(["normal", "amplicon", "srna"]);

export type LibraryType = z.infer<typeof LibraryType>;

/** Sample metadata returned by `GET /samples/{id}`. Provisional shape — fields land as the runner needs them. */
export const Sample = z.object({
	id: z.string(),
	name: z.string(),
	paired: z.boolean(),
	library_type: LibraryType,
	max_length: z.number().int().nonnegative(),
});

export type Sample = z.infer<typeof Sample>;
