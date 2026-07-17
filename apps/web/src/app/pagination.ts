import { num } from "@app/searchParams";

/** The number of items a list view requests per page. */
export const DEFAULT_PER_PAGE = 25;

/** Search params shared by every paginated list route. */
export type Paginated = {
	page: number;
};

/**
 * Coerce the shared `page` search param for a paginated route's
 * `validateSearch`. Spread the result alongside the route's own params.
 */
export function paginated(input: { page?: unknown }): Paginated {
	return { page: num(input.page, 1) };
}
