import { createStorageBackend, type StorageBackend } from "@virtool/storage";
import { config } from "./config";

/**
 * The composition root: the process-wide singletons built once at startup from
 * `config`.
 *
 * `@virtool/storage` and `@virtool/data` take their dependencies as arguments
 * and construct nothing at import time, which is what lets the jobs API and the
 * workflow ports reuse them. Somebody still has to do the construction, and
 * this is where it happens for the web app.
 *
 * **Pass these into `data.ts` functions as arguments.** A `data.ts` module must
 * never import from here — that would put the app's configuration back inside
 * the package's call graph.
 */
export const storage: StorageBackend = createStorageBackend(config.storage);
