import { createQueryKeys } from "@app/queryKeys";

const userKeys = createQueryKeys("users");

/**
 * Query keys for users.
 *
 * `nested()` is the flat list used to populate selectors. It nests under
 * `lists()`, so a single `lists()` invalidation refreshes every list variant.
 */
export const userQueryKeys = {
	...userKeys,
	nested: () => [...userKeys.lists(), "nested"] as const,
};
