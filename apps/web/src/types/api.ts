export type ErrorResponse = {
	response: {
		status: number;
		notFound: boolean;
		statusText: string;
		badRequest: boolean;
		statusCode: number;
		body: { message?: string; [key: string]: unknown };
	};
};

export type SearchResult = {
	/** The number of items found */
	found_count: number;

	/** The current page number */
	page: number;

	/** The total number of pages */
	page_count: number;

	/** The number of items per page */
	per_page: number;

	/** The total number of items */
	total_count: number;
};

/**
 * The camelCase paginated search-result envelope. The forward-looking
 * replacement for {@link SearchResult}: server-function-backed domains return
 * this shape, and once every domain is served from TypeScript it becomes the
 * single envelope and the snake_case `SearchResult` is retired.
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
