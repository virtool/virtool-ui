import { z } from "zod/v4";

export const SseMessageSchema = z
	.object({
		domain: z.string(),
		operation: z.enum(["insert", "update", "delete"]),
		id: z.union([z.number(), z.string()]),
	})
	.strip();

export type SseMessage = z.infer<typeof SseMessageSchema>;
