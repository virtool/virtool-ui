import { config, type StorageConfig } from "../config";
import { createAzureStorage } from "./azure";
import { createS3Storage } from "./s3";
import type { StorageBackend } from "./types";

export { type DeleteFailure, deletePrefix } from "./cleanup";
export { StorageError, StorageKeyNotFoundError } from "./errors";
export * from "./keys";
export { MemoryStorage } from "./memory";
export {
	STORAGE_CHUNK_SIZE,
	type StorageBackend,
	type StorageObjectInfo,
} from "./types";

export function createStorageBackend(
	storageConfig: StorageConfig,
): StorageBackend {
	if (storageConfig.kind === "s3") {
		return createS3Storage(storageConfig);
	}

	return createAzureStorage(storageConfig);
}

/**
 * The process-wide storage backend, built once at startup. Pass it into
 * `data.ts` functions the way `db` is passed — they take it as an argument
 * rather than importing it.
 */
export const storage: StorageBackend = createStorageBackend(config.storage);
