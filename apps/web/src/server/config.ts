import { z } from "zod";

const ServerEnvSchema = z
	.object({
		VT_POSTGRES_URL: z.string().url(),
	})
	.transform((raw) => ({
		postgresUrl: raw.VT_POSTGRES_URL,
	}));

/** Server-side configuration parsed from process.env. */
export type ServerConfig = z.infer<typeof ServerEnvSchema>;

export const config: ServerConfig = ServerEnvSchema.parse(process.env);
