import { apiClient } from "@app/api";
import { createQueryKeys } from "@app/queryKeys";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/api";
import type { HMMInstalled, Hmm, HmmSearchResults } from "./types";

/** Query keys for HMMs. */
export const hmmQueryKeys = createQueryKeys("hmms");

/**
 * Fetch a page of hmm search results from the API
 *
 * @param page - The page to fetch
 * @param per_page - The number of hmms to fetch per page
 * @param term - The search term to filter the hmms by
 * @returns A page of hmms search results
 */
export function useListHmms(page: number, per_page: number, term?: string) {
	return useQuery<HmmSearchResults>({
		queryKey: hmmQueryKeys.list([page, per_page, term]),
		queryFn: () =>
			apiClient
				.get("/hmms")
				.query({ page, per_page, find: term })
				.then((res) => {
					const { documents, ...rest } = res.body;
					return { ...rest, items: documents };
				}),
		placeholderData: keepPreviousData,
	});
}

/**
 * Fetches a single HMM
 *
 * @param hmmId - The id of the hmm to fetch
 * @returns A single HMM
 */
export function useFetchHmm(hmmId: string) {
	return useQuery<Hmm, ErrorResponse>({
		queryKey: hmmQueryKeys.detail(hmmId),
		queryFn: () => apiClient.get(`/hmms/${hmmId}`).then((res) => res.body),
		retry: (failureCount, error) => {
			if (error.response?.status === 404) {
				return false;
			}
			return failureCount <= 3;
		},
	});
}

/**
 * Initializes a mutator for installing hmms
 *
 * @returns A mutator for installing hmms
 */
export function useInstallHmm() {
	const queryClient = useQueryClient();

	return useMutation<HMMInstalled, ErrorResponse>({
		mutationFn: () =>
			apiClient.post("/hmms/status/updates").then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: hmmQueryKeys.lists() });
		},
	});
}
