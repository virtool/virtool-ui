import { createQueryKeys } from "@app/queryKeys";
import type { UploadType } from "./types";

const uploadKeys = createQueryKeys("uploads");

/**
 * Query keys for uploaded files.
 *
 * The upload type leads the filters, so every list of a given type sits under
 * a common prefix. A selection — the uploads named by a set of ids — is cached
 * under its own member derived from the root key.
 */
export const fileQueryKeys = {
	...uploadKeys,
	selections: () => [...uploadKeys.all(), "selection"] as const,
	selection: (type: UploadType, ids: number[]) =>
		[...uploadKeys.all(), "selection", type, ...ids] as const,
};
