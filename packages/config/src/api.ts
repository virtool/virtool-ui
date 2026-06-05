import { z } from "zod";
import { boolFromEnv, intFromEnv } from "./common";
import { buildStorage, type Storage, StorageEnvSchema } from "./storage";

const ApiEnvSchema = z
	.object({
		VT_POSTGRES_URL: z.string().url(),
		VT_WORKER_MODE: z
			.enum(["embedded", "external", "both"])
			.default("embedded"),
		VT_HOST: z.string().default("localhost"),
		VT_PORT: intFromEnv.default(9950),
		VT_PUBLIC_URL: z.string().default(""),
		VT_DEV: boolFromEnv.default(false),
	})
	.merge(StorageEnvSchema)
	.transform((raw, ctx) => ({
		postgresUrl: raw.VT_POSTGRES_URL,
		workerMode: raw.VT_WORKER_MODE,
		host: raw.VT_HOST,
		port: raw.VT_PORT,
		publicUrl: raw.VT_PUBLIC_URL,
		dev: raw.VT_DEV,
		storage: buildStorage(raw, ctx),
	}));

export type ApiConfig = {
	postgresUrl: string;
	workerMode: "embedded" | "external" | "both";
	host: string;
	port: number;
	publicUrl: string;
	dev: boolean;
	storage: Storage;
};

export function parseApiConfig(
	env: NodeJS.ProcessEnv = process.env,
): ApiConfig {
	return ApiEnvSchema.parse(env);
}
