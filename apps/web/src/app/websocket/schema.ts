import { z } from "zod/v4";

export const WsMessageSchema = z.object({
	interface: z.string(),
	operation: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type WsMessage = z.infer<typeof WsMessageSchema>;
