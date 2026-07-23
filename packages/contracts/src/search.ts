/**
 * The camelCase paginated search-result envelope returned by every
 * server-function-backed list. The forward-looking replacement for the
 * snake_case envelope the Python API still returns: once every domain is served
 * from TypeScript this becomes the single envelope and the `V2` drops away.
 */
export type SearchResultV2 = {
	/** The number of items found */
	foundCount: number;

	/** The current page number */
	page: number;

	/** The total number of pages */
	pageCount: number;

	/** The number of items per page */
	perPage: number;

	/** The total number of items */
	totalCount: number;
};
