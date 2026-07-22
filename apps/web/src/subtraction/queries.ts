import {
	createSubtraction,
	deleteSubtraction,
	findSubtractions,
	getSubtraction,
	listSubtractionsShortlist,
	updateSubtraction,
} from "@server/subtraction/functions";
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
		ErrorResponse,
		{ name: string; nickname: string; uploadId: number }
	>({
		mutationFn: ({ name, nickname, uploadId }) =>
			createSubtraction({
				data: { name, nickname, uploadId },
			}) as Promise<Subtraction>,
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
			findSubtractions({
				data: { page, per_page, term },
			}) as Promise<SubtractionSearchResult>,
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
export function useFetchSubtraction(subtractionId: string | number) {
	return useQuery<Subtraction, ErrorResponse>({
		queryKey: subtractionQueryKeys.detail(subtractionId),
		queryFn: () =>
			getSubtraction({
				data: { subtractionId: Number(subtractionId) },
			}) as Promise<Subtraction>,
	});
}

/**
 * Initializes a mutator for updating a subtraction
 *
 * @param subtractionId - The id of the subtraction to update
 * @returns A mutator for updating a subtraction
 */
export function useUpdateSubtraction(subtractionId: string | number) {
	const queryClient = useQueryClient();
	return useMutation<
		Subtraction,
		ErrorResponse,
		{ name: string; nickname: string }
	>({
		mutationFn: ({ name, nickname }) =>
			updateSubtraction({
				data: { subtractionId: Number(subtractionId), name, nickname },
			}) as Promise<Subtraction>,
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
	return useMutation<null, ErrorResponse, { subtractionId: string | number }>({
		mutationFn: ({ subtractionId }) =>
			deleteSubtraction({
				data: { subtractionId: Number(subtractionId) },
			}) as Promise<null>,
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
			listSubtractionsShortlist({
				data: { ready: ready ?? false },
			}) as Promise<SubtractionOption[]>,
	});
}
