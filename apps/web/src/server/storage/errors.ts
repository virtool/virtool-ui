import { AppError } from "../errors";

/** Base error for failed storage operations. */
export class StorageError extends AppError {}

/** Thrown when a requested key does not exist in storage. */
export class StorageKeyNotFoundError extends StorageError {
	constructor(readonly key: string) {
		super(key);
	}
}
