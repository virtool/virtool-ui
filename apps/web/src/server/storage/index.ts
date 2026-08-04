import type { StorageBackend } from "@virtool/storage/types";
import { config } from "../config";
import { createStorageBackend } from "./factory";

export { StorageError, StorageKeyNotFoundError } from "@virtool/storage/errors";
export * from "@virtool/storage/keys";
export {
	STORAGE_CHUNK_SIZE,
	type StorageBackend,
	type StorageObjectInfo,
} from "@virtool/storage/types";
export { type DeleteFailure, deletePrefix } from "./cleanup";
export { createStorageBackend } from "./factory";
export { MemoryStorage } from "./memory";

/**
 * The process-wide storage backend, built once at startup. Pass it into
 * `data.ts` functions the way `db` is passed — they take it as an argument
 * rather than importing it.
 */
export const storage: StorageBackend = createStorageBackend(config.storage);
