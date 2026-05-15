import { z } from "zod";

/** Analysis metadata returned by `GET /analyses/{id}`. Provisional shape. */
export const Analysis = z.object({
	id: z.string(),
});

export type Analysis = z.infer<typeof Analysis>;

/** Body for the single-call `POST /analyses/{id}/results` write. */
export const AnalysisFinalize = z.object({
	results: z.unknown(),
});

export type AnalysisFinalize = z.infer<typeof AnalysisFinalize>;
