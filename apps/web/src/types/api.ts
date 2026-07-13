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

export type Task = {
	complete: boolean;
	created_at: Date;
	error: string | null;
	id: number;
	progress: number;
	step: string;
	type: string;
};
