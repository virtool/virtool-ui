import { apiClient } from "@app/api";
import { indexQueryKeys } from "@indexes/keys";
import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/api";
import type {
	Index,
	IndexMinimal,
	IndexSearchResult,
	UnbuiltChangesSearchResults,
} from "./types";

/**
 * Query options for a paginated list of indexes.
 *
 * @param page - The page to fetch
 * @param per_page - The number of indexes to fetch per page
 * @param refId - The reference id to fetch the indexes of
 * @param term - The search term to filter indexes by
 */
export function indexesQueryOptions(
	page: number,
	per_page: number,
	refId: string,
	term?: string,
) {
	return queryOptions<IndexSearchResult, ErrorResponse>({
		queryKey: indexQueryKeys.list([page, per_page, refId, term]),
		queryFn: () =>
			apiClient
				.get(`/refs/${refId}/indexes`)
				.query({ find: term, page, per_page })
				.then((res) => {
					const { documents, ...rest } = res.body;
					return { ...rest, items: documents };
				}),
	});
}

/**
 * Gets a paginated list of indexes.
 *
 * For secondary data — the unbuilt-changes alert beside a list. Primary list
 * data uses {@link useSuspenseIndexes}.
 *
 * @param page - The page to fetch
 * @param per_page - The number of indexes to fetch per page
 * @param refId - The reference id to fetch the indexes of
 * @param term - The search term to filter indexes by
 * @returns The paginated list of indexes
 */
export function useFindIndexes(
	page: number,
	per_page: number,
	refId: string,
	term?: string,
) {
	return useQuery(indexesQueryOptions(page, per_page, refId, term));
}

/**
 * Fetch a paginated list of indexes, suspending until it resolves.
 *
 * `data` is always defined, and a failed request throws to the nearest route
 * error boundary instead of resolving to `undefined`. Use this from components
 * rendered under the index list route, whose loader prefetches the page —
 * loading and errors are handled by the route's Suspense and `errorComponent`
 * rather than inline.
 */
export function useSuspenseIndexes(
	page: number,
	per_page: number,
	refId: string,
	term?: string,
) {
	return useSuspenseQuery(indexesQueryOptions(page, per_page, refId, term));
}

type ListIndexesOptions = {
	/** Only return ready indexes */
	ready: boolean;

	/** Filter indexes by their reference's archived status */
	archived?: boolean;
};

/**
 * Gets a list of ready indexes
 *
 * @param options - The ready and archived filters to apply
 * @returns A list of ready indexes
 */
export function useListIndexes({ ready, archived }: ListIndexesOptions) {
	const params = archived === undefined ? { ready } : { ready, archived };

	return useQuery<IndexMinimal[]>({
		queryKey: indexQueryKeys.list(Object.values(params)),
		queryFn: () =>
			apiClient
				.get("/indexes")
				.query(params)
				.then((res) => res.body),
	});
}

/**
 * Fetches a single index
 *
 * @param indexId - The id of the index to fetch
 * @param enabled - Whether the query should run
 * @returns A single index
 */
export function useFetchIndex(indexId: string, enabled = true) {
	return useQuery<Index, ErrorResponse>({
		queryKey: indexQueryKeys.detail(indexId),
		queryFn: () => apiClient.get(`/indexes/${indexId}`).then((res) => res.body),
		enabled: enabled && Boolean(indexId),
	});
}

/**
 * Get a list of unbuilt changes for a reference
 *
 * @param refId - The id of the reference to fetch unbuilt changes for
 * @returns A list of unbuilt changes for a reference
 */
export function useFetchUnbuiltChanges(refId: string) {
	return useQuery<UnbuiltChangesSearchResults>({
		queryFn: () =>
			apiClient.get(`/refs/${refId}/history?unbuilt=true`).then((res) => {
				const { documents, ...rest } = res.body;
				return { ...rest, items: documents };
			}),
		queryKey: indexQueryKeys.unbuilt(refId),
	});
}

/**
 * Initializes a mutator for creating an index
 *
 * @returns A mutator for creating an index
 */
export function useCreateIndex() {
	const queryClient = useQueryClient();
	return useMutation<Index, ErrorResponse, { refId: string }>({
		mutationFn: ({ refId }) =>
			apiClient.post(`/refs/${refId}/indexes`).then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: indexQueryKeys.all(),
			});
		},
	});
}
