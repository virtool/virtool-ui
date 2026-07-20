import { z } from "zod";

/** HMM profile metadata returned by `GET /hmms` (nuvs only). Provisional shape. */
export const Hmms = z.array(
	z.object({
		id: z.number().int().nonnegative(),
		cluster: z.number().int().nonnegative(),
	}),
);

export type Hmms = z.infer<typeof Hmms>;
