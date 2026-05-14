import { z } from "zod";

export type Storage =
	| {
			kind: "s3";
			bucket: string;
			endpoint: string;
			accessKeyId: string;
			secretAccessKey: string;
			region?: string;
	  }
	| {
			kind: "azure";
			account: string;
			container: string;
			accessKey?: string;
			endpoint?: string;
	  }
	| {
			kind: "local";
			path: string;
	  };

export const StorageEnvSchema = z.object({
	VT_STORAGE_BACKEND: z.enum(["s3", "azure", "local"]),
	VT_STORAGE_S3_BUCKET: z.string().optional(),
	VT_STORAGE_S3_REGION: z.string().optional(),
	VT_STORAGE_S3_ENDPOINT: z.string().optional(),
	VT_STORAGE_S3_ACCESS_KEY_ID: z.string().optional(),
	VT_STORAGE_S3_SECRET_ACCESS_KEY: z.string().optional(),
	VT_STORAGE_AZURE_ACCOUNT: z.string().optional(),
	VT_STORAGE_AZURE_CONTAINER: z.string().optional(),
	VT_STORAGE_AZURE_ACCESS_KEY: z.string().optional(),
	VT_STORAGE_AZURE_ENDPOINT: z.string().optional(),
	VT_STORAGE_LOCAL_PATH: z.string().optional(),
});

export type StorageEnv = z.infer<typeof StorageEnvSchema>;

export function buildStorage(raw: StorageEnv, ctx: z.RefinementCtx): Storage {
	if (raw.VT_STORAGE_BACKEND === "s3") {
		let s3Ok = true;
		const required: Array<[keyof StorageEnv, string]> = [
			["VT_STORAGE_S3_BUCKET", "VT_STORAGE_S3_BUCKET"],
			["VT_STORAGE_S3_ENDPOINT", "VT_STORAGE_S3_ENDPOINT"],
			["VT_STORAGE_S3_ACCESS_KEY_ID", "VT_STORAGE_S3_ACCESS_KEY_ID"],
			["VT_STORAGE_S3_SECRET_ACCESS_KEY", "VT_STORAGE_S3_SECRET_ACCESS_KEY"],
		];
		for (const [key, path] of required) {
			if (!raw[key]) {
				ctx.addIssue({
					code: "custom",
					path: [path],
					message: `${key} is required when VT_STORAGE_BACKEND=s3`,
				});
				s3Ok = false;
			}
		}
		if (!s3Ok) return z.NEVER as never;
		return {
			kind: "s3",
			bucket: raw.VT_STORAGE_S3_BUCKET as string,
			endpoint: raw.VT_STORAGE_S3_ENDPOINT as string,
			accessKeyId: raw.VT_STORAGE_S3_ACCESS_KEY_ID as string,
			secretAccessKey: raw.VT_STORAGE_S3_SECRET_ACCESS_KEY as string,
			region: raw.VT_STORAGE_S3_REGION || undefined,
		};
	}

	if (raw.VT_STORAGE_BACKEND === "local") {
		if (!raw.VT_STORAGE_LOCAL_PATH) {
			ctx.addIssue({
				code: "custom",
				path: ["VT_STORAGE_LOCAL_PATH"],
				message:
					"VT_STORAGE_LOCAL_PATH is required when VT_STORAGE_BACKEND=local",
			});
			return z.NEVER as never;
		}
		return { kind: "local", path: raw.VT_STORAGE_LOCAL_PATH };
	}

	let azureOk = true;
	if (!raw.VT_STORAGE_AZURE_ACCOUNT) {
		ctx.addIssue({
			code: "custom",
			path: ["VT_STORAGE_AZURE_ACCOUNT"],
			message:
				"VT_STORAGE_AZURE_ACCOUNT is required when VT_STORAGE_BACKEND=azure",
		});
		azureOk = false;
	}
	if (!raw.VT_STORAGE_AZURE_CONTAINER) {
		ctx.addIssue({
			code: "custom",
			path: ["VT_STORAGE_AZURE_CONTAINER"],
			message:
				"VT_STORAGE_AZURE_CONTAINER is required when VT_STORAGE_BACKEND=azure",
		});
		azureOk = false;
	}
	if (!azureOk) return z.NEVER as never;

	return {
		kind: "azure",
		account: raw.VT_STORAGE_AZURE_ACCOUNT as string,
		container: raw.VT_STORAGE_AZURE_CONTAINER as string,
		accessKey: raw.VT_STORAGE_AZURE_ACCESS_KEY || undefined,
		endpoint: raw.VT_STORAGE_AZURE_ENDPOINT || undefined,
	};
}
