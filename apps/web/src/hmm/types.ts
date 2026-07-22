import type { HmmMinimal, HmmSearchResult } from "@server/hmm/data";

/**
 * The HMM wire shapes are defined once in the server data layer and read
 * straight off the server functions; they are re-exported here so components
 * can import them from the feature barrel.
 */
export type { Hmm, HmmMinimal, HmmSearchResult } from "@server/hmm/data";

/**
 * HMM search results after the UI transform that renames the server's
 * `documents` to `items`.
 */
export type HmmSearchResults = Omit<HmmSearchResult, "documents"> & {
	items: HmmMinimal[];
};
