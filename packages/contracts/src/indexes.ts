import { z } from "zod";

/** Index metadata returned by `GET /indexes/{id}`. Provisional shape. */
export const Index = z.object({
	id: z.string(),
});

export type Index = z.infer<typeof Index>;
