import { apiClient } from "@app/api";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/api";
import type {
	Subtraction,
	SubtractionOption,
	SubtractionSearchResult,
} from "./types";

/**
 * Factory object for generating subtraction query keys
 */
export const subtractionQueryKeys = {
	all: () => ["subtraction"] as const,
	lists: () => ["subtraction", "list"] as const,
	list: (filters: Array<string | number | boolean>) =>
		["subtraction", "list", ...filters] as const,
	details: () => ["subtraction", "details"] as const,
	detail: (subtractionId: string) =>
		["subtraction", "details", subtractionId] as const,
	shortlist: () => ["subtraction", "list", "short"] as const,
};

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
 * Fetch a page of subtraction search results from the API
 *
 * @param page - The page to fetch
 * @param per_page - The number of hmms to fetch per page
 * @param term - The search term to filter the hmms by
 * @returns A page of subtraction search results
 */
export function useFindSubtractions(
	page: number,
	per_page: number,
	term: string,
) {
	return useQuery<SubtractionSearchResult>({
		queryKey: subtractionQueryKeys.list([page, per_page, term]),
		queryFn: () =>
			apiClient
				.get("/subtractions")
				.query({ page, per_page, find: term })
				.then((response) => {
					const { documents, ...rest } = response.body;
					return { ...rest, items: documents };
				}),
		placeholderData: keepPreviousData,
	});
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
		queryKey: subtractionQueryKeys.shortlist(),
		queryFn: () =>
			apiClient
				.get("/subtractions")
				.query({ short: true, ready })
				.then((response) => response.body),
	});
}
