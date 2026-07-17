import { apiClient } from "@app/api";
import { subtractionQueryKeys } from "@subtraction/keys";
import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/api";
import type {
	Subtraction,
	SubtractionOption,
	SubtractionSearchResult,
} from "./types";

/**
 * Initializes a mutator for creating a subtraction
 *
 * @returns A mutator for creating a subtraction
 */
export function useCreateSubtraction() {
	const queryClient = useQueryClient();

	return useMutation<
		Subtraction,
		unknown,
		{ name: string; nickname: string; uploadId: number }
	>({
		mutationFn: ({ name, nickname, uploadId }) =>
			apiClient
				.post("/subtractions")
				.send({ name, nickname, upload_id: uploadId })
				.then((response) => response.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: subtractionQueryKeys.lists(),
			});
		},
	});
}

/**
 * Query options for a page of subtraction search results.
 *
 * @param page - The page to fetch
 * @param per_page - The number of subtractions to fetch per page
 * @param term - The search term to filter the subtractions by
 */
export function subtractionsQueryOptions(
	page: number,
	per_page: number,
	term: string,
) {
	return queryOptions<SubtractionSearchResult, ErrorResponse>({
		queryKey: subtractionQueryKeys.list([page, per_page, term]),
		queryFn: () =>
			apiClient
				.get("/subtractions")
				.query({ page, per_page, find: term })
				.then((response) => {
					const { documents, ...rest } = response.body;
					return { ...rest, items: documents };
				}),
	});
}

/**
 * Fetch a page of subtraction search results, suspending until it resolves.
 *
 * `data` is always defined, and a failed request throws to the nearest route
 * error boundary instead of resolving to `undefined`. Use this from components
 * rendered under the subtraction list route, whose loader prefetches the page —
 * loading and errors are handled by the route's Suspense and `errorComponent`
 * rather than inline.
 */
export function useSuspenseSubtractions(
	page: number,
	per_page: number,
	term: string,
) {
	return useSuspenseQuery(subtractionsQueryOptions(page, per_page, term));
}

/**
 * Fetches a single subtraction
 *
 * @param subtractionId - The id of the subtraction to fetch
 * @returns A single subtraction
 */
export function useFetchSubtraction(subtractionId: string) {
	return useQuery<Subtraction, ErrorResponse>({
		queryKey: subtractionQueryKeys.detail(subtractionId),
		queryFn: () =>
			apiClient
				.get(`/subtractions/${subtractionId}`)
				.then((response) => response.body),
	});
}

/**
 * Initializes a mutator for updating a subtraction
 *
 * @param subtractionId - The id of the subtraction to update
 * @returns A mutator for updating a subtraction
 */
export function useUpdateSubtraction(subtractionId: string) {
	const queryClient = useQueryClient();
	return useMutation<Subtraction, unknown, { name: string; nickname: string }>({
		mutationFn: ({ name, nickname }) =>
			apiClient
				.patch(`/subtractions/${subtractionId}`)
				.send({ name, nickname })
				.then((response) => response.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: subtractionQueryKeys.detail(subtractionId),
			});
		},
	});
}

/**
 * Initializes a mutator for removing a subtraction
 *
 * @returns A mutator for removing a subtraction
 */
export function useRemoveSubtraction() {
	return useMutation<Response, unknown, { subtractionId: string }>({
		mutationFn: ({ subtractionId }) =>
			apiClient
				.delete(`/subtractions/${subtractionId}`)
				.then((response) => response.body),
	});
}

/**
 * Fetches a list of subtractions with reduced information
 *
 * @param ready - Indicates whether to show all the ready subtractions
 * @returns A list of subtractions
 */
export function useFetchSubtractionsShortlist(ready?: boolean) {
	return useQuery<SubtractionOption[]>({
		queryKey: subtractionQueryKeys.shortlist(ready),
		queryFn: () =>
			apiClient
				.get("/subtractions")
				.query({ short: true, ready })
				.then((response) => response.body),
	});
}
