import { describe, expect, it } from "vitest";
import { parseServerConfig } from "../config";

const postgresUrl = "postgres://virtool:virtool@localhost:5432/virtool";

const minimalS3 = {
	VT_POSTGRES_URL: postgresUrl,
	VT_STORAGE_BACKEND: "s3",
	VT_STORAGE_S3_BUCKET: "virtool",
} as NodeJS.ProcessEnv;

const minimalAzure = {
	VT_POSTGRES_URL: postgresUrl,
	VT_STORAGE_BACKEND: "azure",
	VT_STORAGE_AZURE_ACCOUNT: "devstoreaccount1",
	VT_STORAGE_AZURE_CONTAINER: "virtool",
} as NodeJS.ProcessEnv;

describe("parseServerConfig", () => {
	it("errors when the postgres url is missing", () => {
		expect(() =>
			parseServerConfig({
				VT_STORAGE_BACKEND: "s3",
				VT_STORAGE_S3_BUCKET: "virtool",
			} as NodeJS.ProcessEnv),
		).toThrow(/VT_POSTGRES_URL/);
	});

	it("errors when the storage backend is missing", () => {
		expect(() =>
			parseServerConfig({ VT_POSTGRES_URL: postgresUrl } as NodeJS.ProcessEnv),
		).toThrow(/VT_STORAGE_BACKEND/);
	});

	it("rejects the removed local backend", () => {
		expect(() =>
			parseServerConfig({
				VT_POSTGRES_URL: postgresUrl,
				VT_STORAGE_BACKEND: "local",
				VT_STORAGE_LOCAL_PATH: "/var/lib/virtool/storage",
			} as NodeJS.ProcessEnv),
		).toThrow(/VT_STORAGE_BACKEND/);
	});

	describe("s3", () => {
		it("parses without an endpoint, region, or credentials", () => {
			const config = parseServerConfig(minimalS3);

			expect(config.postgresUrl).toBe(postgresUrl);
			expect(config.storage).toEqual({
				kind: "s3",
				bucket: "virtool",
				region: undefined,
				endpoint: undefined,
				accessKeyId: undefined,
				secretAccessKey: undefined,
			});
		});

		it("parses a custom endpoint, region, and credentials", () => {
			const config = parseServerConfig({
				...minimalS3,
				VT_STORAGE_S3_REGION: "garage",
				VT_STORAGE_S3_ENDPOINT: "http://garage:3900",
				VT_STORAGE_S3_ACCESS_KEY_ID: "ak",
				VT_STORAGE_S3_SECRET_ACCESS_KEY: "sk",
			} as NodeJS.ProcessEnv);

			expect(config.storage).toEqual({
				kind: "s3",
				bucket: "virtool",
				region: "garage",
				endpoint: "http://garage:3900",
				accessKeyId: "ak",
				secretAccessKey: "sk",
			});
		});

		it("errors when the bucket is missing", () => {
			expect(() =>
				parseServerConfig({
					VT_POSTGRES_URL: postgresUrl,
					VT_STORAGE_BACKEND: "s3",
				} as NodeJS.ProcessEnv),
			).toThrow(/VT_STORAGE_S3_BUCKET/);
		});

		it("errors when only the access key id is set", () => {
			expect(() =>
				parseServerConfig({
					...minimalS3,
					VT_STORAGE_S3_ACCESS_KEY_ID: "ak",
				} as NodeJS.ProcessEnv),
			).toThrow(/must be set together/);
		});

		it("errors when only the secret access key is set", () => {
			expect(() =>
				parseServerConfig({
					...minimalS3,
					VT_STORAGE_S3_SECRET_ACCESS_KEY: "sk",
				} as NodeJS.ProcessEnv),
			).toThrow(/must be set together/);
		});

		it("treats an empty credential as unset rather than as one of a pair", () => {
			const config = parseServerConfig({
				...minimalS3,
				VT_STORAGE_S3_ACCESS_KEY_ID: "",
				VT_STORAGE_S3_SECRET_ACCESS_KEY: "",
			} as NodeJS.ProcessEnv);

			expect(config.storage).toMatchObject({
				accessKeyId: undefined,
				secretAccessKey: undefined,
			});
		});
	});

	describe("azure", () => {
		it("parses without an access key or endpoint", () => {
			const config = parseServerConfig(minimalAzure);

			expect(config.storage).toEqual({
				kind: "azure",
				account: "devstoreaccount1",
				container: "virtool",
				accessKey: undefined,
				endpoint: undefined,
			});
		});

		it("parses an access key and endpoint override", () => {
			const config = parseServerConfig({
				...minimalAzure,
				VT_STORAGE_AZURE_ACCESS_KEY: "key",
				VT_STORAGE_AZURE_ENDPOINT: "http://azurite:10000/devstoreaccount1",
			} as NodeJS.ProcessEnv);

			expect(config.storage).toEqual({
				kind: "azure",
				account: "devstoreaccount1",
				container: "virtool",
				accessKey: "key",
				endpoint: "http://azurite:10000/devstoreaccount1",
			});
		});

		it("errors when the account is missing", () => {
			expect(() =>
				parseServerConfig({
					VT_POSTGRES_URL: postgresUrl,
					VT_STORAGE_BACKEND: "azure",
					VT_STORAGE_AZURE_CONTAINER: "virtool",
				} as NodeJS.ProcessEnv),
			).toThrow(/VT_STORAGE_AZURE_ACCOUNT/);
		});

		it("errors when the container is missing", () => {
			expect(() =>
				parseServerConfig({
					VT_POSTGRES_URL: postgresUrl,
					VT_STORAGE_BACKEND: "azure",
					VT_STORAGE_AZURE_ACCOUNT: "devstoreaccount1",
				} as NodeJS.ProcessEnv),
			).toThrow(/VT_STORAGE_AZURE_CONTAINER/);
		});
	});
});
