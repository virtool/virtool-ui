import { z } from "zod";

/** Subtraction metadata returned by `GET /subtractions/{id}`. Provisional shape. */
export const Subtraction = z.object({
	id: z.int(),
});

export type Subtraction = z.infer<typeof Subtraction>;
