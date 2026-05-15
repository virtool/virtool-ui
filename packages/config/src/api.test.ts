import { describe, expect, it } from "vitest";
import { parseApiConfig } from "./api";

const minimalS3 = {
	VT_POSTGRES_URL: "postgres://u:p@h:5432/v",
	VT_MONGODB_URL: "mongodb://u:p@h:27017/v",
	VT_STORAGE_BACKEND: "s3",
	VT_STORAGE_S3_BUCKET: "virtool",
	VT_STORAGE_S3_ENDPOINT: "http://garage:3900",
	VT_STORAGE_S3_ACCESS_KEY_ID: "ak",
	VT_STORAGE_S3_SECRET_ACCESS_KEY: "sk",
};

describe("parseApiConfig", () => {
	it("errors when required URLs are missing", () => {
		expect(() =>
			parseApiConfig({
				VT_STORAGE_BACKEND: "s3",
				VT_STORAGE_S3_BUCKET: "b",
				VT_STORAGE_S3_ENDPOINT: "http://garage:3900",
				VT_STORAGE_S3_ACCESS_KEY_ID: "ak",
				VT_STORAGE_S3_SECRET_ACCESS_KEY: "sk",
			} as NodeJS.ProcessEnv),
		).toThrow(/VT_POSTGRES_URL/);
	});

	it("errors when storage backend is missing", () => {
		expect(() =>
			parseApiConfig({
				VT_POSTGRES_URL: "postgres://u:p@h/v",
				VT_MONGODB_URL: "mongodb://u:p@h/v",
			} as NodeJS.ProcessEnv),
		).toThrow(/VT_STORAGE_BACKEND/);
	});

	it("applies defaults for host/port/publicUrl/dev", () => {
		const cfg = parseApiConfig(minimalS3 as NodeJS.ProcessEnv);
		expect(cfg.host).toBe("localhost");
		expect(cfg.port).toBe(9950);
		expect(cfg.publicUrl).toBe("");
		expect(cfg.dev).toBe(false);
		expect(cfg.workerMode).toBe("embedded");
	});

	it("parses worker mode", () => {
		const cfg = parseApiConfig({
			...minimalS3,
			VT_WORKER_MODE: "external",
		} as NodeJS.ProcessEnv);
		expect(cfg.workerMode).toBe("external");
	});

	it("errors when worker mode is invalid", () => {
		expect(() =>
			parseApiConfig({
				...minimalS3,
				VT_WORKER_MODE: "dev",
			} as NodeJS.ProcessEnv),
		).toThrow(/VT_WORKER_MODE/);
	});

	it("coerces VT_PORT and VT_DEV from strings", () => {
		const cfg = parseApiConfig({
			...minimalS3,
			VT_PORT: "3001",
			VT_DEV: "true",
		} as NodeJS.ProcessEnv);
		expect(cfg.port).toBe(3001);
		expect(cfg.dev).toBe(true);
	});

	it("parses s3 storage with optional region", () => {
		const cfg = parseApiConfig({
			...minimalS3,
			VT_STORAGE_S3_REGION: "us-east-1",
		} as NodeJS.ProcessEnv);
		expect(cfg.storage).toEqual({
			kind: "s3",
			bucket: "virtool",
			endpoint: "http://garage:3900",
			accessKeyId: "ak",
			secretAccessKey: "sk",
			region: "us-east-1",
		});
	});

	it("parses s3 storage without optional region", () => {
		const cfg = parseApiConfig(minimalS3 as NodeJS.ProcessEnv);
		expect(cfg.storage).toEqual({
			kind: "s3",
			bucket: "virtool",
			endpoint: "http://garage:3900",
			accessKeyId: "ak",
			secretAccessKey: "sk",
			region: undefined,
		});
	});

	it("errors when s3 backend is missing bucket", () => {
		expect(() =>
			parseApiConfig({
				VT_POSTGRES_URL: "postgres://u:p@h/v",
				VT_MONGODB_URL: "mongodb://u:p@h/v",
				VT_STORAGE_BACKEND: "s3",
				VT_STORAGE_S3_ENDPOINT: "http://garage:3900",
				VT_STORAGE_S3_ACCESS_KEY_ID: "ak",
				VT_STORAGE_S3_SECRET_ACCESS_KEY: "sk",
			} as NodeJS.ProcessEnv),
		).toThrow(/VT_STORAGE_S3_BUCKET/);
	});

	it("errors when s3 backend is missing endpoint", () => {
		expect(() =>
			parseApiConfig({
				VT_POSTGRES_URL: "postgres://u:p@h/v",
				VT_MONGODB_URL: "mongodb://u:p@h/v",
				VT_STORAGE_BACKEND: "s3",
				VT_STORAGE_S3_BUCKET: "virtool",
				VT_STORAGE_S3_ACCESS_KEY_ID: "ak",
				VT_STORAGE_S3_SECRET_ACCESS_KEY: "sk",
			} as NodeJS.ProcessEnv),
		).toThrow(/VT_STORAGE_S3_ENDPOINT/);
	});

	it("errors when s3 backend is missing access keys", () => {
		expect(() =>
			parseApiConfig({
				VT_POSTGRES_URL: "postgres://u:p@h/v",
				VT_MONGODB_URL: "mongodb://u:p@h/v",
				VT_STORAGE_BACKEND: "s3",
				VT_STORAGE_S3_BUCKET: "virtool",
				VT_STORAGE_S3_ENDPOINT: "http://garage:3900",
			} as NodeJS.ProcessEnv),
		).toThrow(/VT_STORAGE_S3_ACCESS_KEY_ID/);
	});

	it("parses azure storage with required fields", () => {
		const cfg = parseApiConfig({
			VT_POSTGRES_URL: "postgres://u:p@h/v",
			VT_MONGODB_URL: "mongodb://u:p@h/v",
			VT_STORAGE_BACKEND: "azure",
			VT_STORAGE_AZURE_ACCOUNT: "devstoreaccount1",
			VT_STORAGE_AZURE_CONTAINER: "virtool",
		} as NodeJS.ProcessEnv);
		expect(cfg.storage).toEqual({
			kind: "azure",
			account: "devstoreaccount1",
			container: "virtool",
			accessKey: undefined,
			endpoint: undefined,
		});
	});

	it("parses azure storage with an endpoint override", () => {
		const cfg = parseApiConfig({
			VT_POSTGRES_URL: "postgres://u:p@h/v",
			VT_MONGODB_URL: "mongodb://u:p@h/v",
			VT_STORAGE_BACKEND: "azure",
			VT_STORAGE_AZURE_ACCOUNT: "devstoreaccount1",
			VT_STORAGE_AZURE_CONTAINER: "virtool",
			VT_STORAGE_AZURE_ENDPOINT: "http://localhost:10000/devstoreaccount1",
		} as NodeJS.ProcessEnv);
		expect(cfg.storage).toEqual({
			kind: "azure",
			account: "devstoreaccount1",
			container: "virtool",
			accessKey: undefined,
			endpoint: "http://localhost:10000/devstoreaccount1",
		});
	});

	it("parses local storage with required path", () => {
		const cfg = parseApiConfig({
			VT_POSTGRES_URL: "postgres://u:p@h/v",
			VT_MONGODB_URL: "mongodb://u:p@h/v",
			VT_STORAGE_BACKEND: "local",
			VT_STORAGE_LOCAL_PATH: "/var/lib/virtool/storage",
		} as NodeJS.ProcessEnv);
		expect(cfg.storage).toEqual({
			kind: "local",
			path: "/var/lib/virtool/storage",
		});
	});

	it("errors when local backend is missing path", () => {
		expect(() =>
			parseApiConfig({
				VT_POSTGRES_URL: "postgres://u:p@h/v",
				VT_MONGODB_URL: "mongodb://u:p@h/v",
				VT_STORAGE_BACKEND: "local",
			} as NodeJS.ProcessEnv),
		).toThrow(/VT_STORAGE_LOCAL_PATH/);
	});

	it("errors when azure backend is missing account or container", () => {
		expect(() =>
			parseApiConfig({
				VT_POSTGRES_URL: "postgres://u:p@h/v",
				VT_MONGODB_URL: "mongodb://u:p@h/v",
				VT_STORAGE_BACKEND: "azure",
			} as NodeJS.ProcessEnv),
		).toThrow(/VT_STORAGE_AZURE/);
	});
});
