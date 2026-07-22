import { createQueryKeys } from "@app/queryKeys";

const subtractionKeys = createQueryKeys("subtractions");

/**
 * Query keys for subtractions.
 *
 * `shortlist()` is the reduced list used to populate selectors. It nests under
 * `lists()` so that a list invalidation refreshes it too.
 */
export const subtractionQueryKeys = {
	...subtractionKeys,
	shortlist: () => [...subtractionKeys.lists(), "short"] as const,
};
