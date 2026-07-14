import { createQueryKeys } from "@app/queryKeys";

const bannerKeys = createQueryKeys("banner");

/**
 * Query keys for banners.
 *
 * `active()` is the single banner shown to every user, which is a distinct
 * resource from the admin list rather than a member of it.
 */
export const bannerQueryKeys = {
	...bannerKeys,
	active: () => [...bannerKeys.all(), "active"] as const,
};
