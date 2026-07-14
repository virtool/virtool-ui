import { createQueryKeys } from "@app/queryKeys";

const otuKeys = createQueryKeys("otus");

/**
 * Query keys for OTUs.
 *
 * `history()` nests under the OTU's own detail key, so the mutations that
 * invalidate a detail also refresh the change history they just added to.
 */
export const otuQueryKeys = {
	...otuKeys,
	history: (id: string) => [...otuKeys.detail(id), "history"] as const,
};
