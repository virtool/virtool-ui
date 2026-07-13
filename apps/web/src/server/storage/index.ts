import { config } from "../config";
import { createStorageBackend } from "./factory";
import type { StorageBackend } from "./types";

export { type DeleteFailure, deletePrefix } from "./cleanup";
export { StorageError, StorageKeyNotFoundError } from "./errors";
export { createStorageBackend } from "./factory";
export * from "./keys";
export { MemoryStorage } from "./memory";
export {
	STORAGE_CHUNK_SIZE,
	type StorageBackend,
	type StorageObjectInfo,
} from "./types";

/**
 * The process-wide storage backend, built once at startup. Pass it into
 * `data.ts` functions the way `db` is passed — they take it as an argument
 * rather than importing it.
 */
export const storage: StorageBackend = createStorageBackend(config.storage);
