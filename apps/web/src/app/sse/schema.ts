import { z } from "zod/v4";

export const SseMessageSchema = z
	.object({
		interface: z.string(),
		operation: z.enum(["insert", "update", "delete"]),
		data: z.object({ id: z.union([z.number(), z.string()]) }),
	})
	.strip();

export type SseMessage = z.infer<typeof SseMessageSchema>;
