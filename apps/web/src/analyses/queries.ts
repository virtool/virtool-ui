import { apiClient } from "@app/api";
import { createQueryKeys } from "@app/queryKeys";
import { samplesQueryKeys } from "@samples/queries";
import {
	keepPreviousData,
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/api";
import type { Analysis, AnalysisSearchResult, GenericAnalysis } from "./types";
import { formatData } from "./utils";

/** Query keys for analyses. */
export const analysesQueryKeys = createQueryKeys("analyses");

/**
 * Fetch a page of analyses search results from the API
 *
 * @param sampleId - The sample which the analyses are associated with
 * @param page - The page to fetch
 * @param per_page - The number of analyses to fetch per page
 * @param term - The search term to filter the analyses by
 * @returns A page of analyses search results
 */
export function useListAnalyses(
	sampleId: string,
	page: number,
	per_page: number,
	term?: string,
) {
	return useQuery<AnalysisSearchResult>({
		queryKey: analysesQueryKeys.list([sampleId, page, per_page, term]),
		queryFn: () =>
			apiClient
				.get(`/samples/${sampleId}/analyses`)
				.query({ page, per_page, find: term })
				.then((res) => {
					const { documents, ...rest } = res.body;
					return { ...rest, items: documents };
				}),
		placeholderData: keepPreviousData,
	});
}

/**
 * Initializes a mutator for removing an analysis
 *
 * @param analysisId - The id of the analysis to remove
 * @returns A mutator for removing an analysis
 */
export function useRemoveAnalysis(analysisId: string) {
	const queryClient = useQueryClient();

	const mutation = useMutation<null, unknown, { analysisId: string }>({
		mutationFn: ({ analysisId }) =>
			apiClient.delete(`/analyses/${analysisId}`).then((res) => res.body),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: analysesQueryKeys.lists(),
			});
		},
	});

	return () => mutation.mutate({ analysisId });
}

export function analysisQueryOptions(analysisId: string) {
	return queryOptions<Analysis, ErrorResponse>({
		queryKey: analysesQueryKeys.detail(analysisId),
		queryFn: async () => {
			const response = await apiClient.get(`/analyses/${analysisId}`);
			return response.body;
		},
	});
}

export function useGetAnalysis(analysisId: string) {
	return useQuery({
		...analysisQueryOptions(analysisId),
		select: formatData,
	});
}

export type CreateAnalysisParams = {
	refId?: string;
	sampleId: string;
	subtractionIds?: string[];
	workflow: string;
};

export function useCreateAnalysis() {
	const queryClient = useQueryClient();

	return useMutation<GenericAnalysis, unknown, CreateAnalysisParams>({
		mutationFn: ({ refId, sampleId, subtractionIds, workflow }) =>
			apiClient
				.post(`/samples/${sampleId}/analyses`)
				.send({
					workflow,
					ref_id: refId,
					subtractions: subtractionIds,
				})
				.then((res) => res.body),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: analysesQueryKeys.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: samplesQueryKeys.lists(),
			});
		},
	});
}

/**
 * Initializes a mutator for installing blast information for a sequence
 *
 * @param analysisId - The id of the analysis the sequence belongs to
 * @returns A mutator for installing the blast information
 */
export function useBlastNuvs(analysisId: string) {
	const queryClient = useQueryClient();

	return useMutation<null, unknown, { sequenceIndex: number }>({
		mutationFn: ({ sequenceIndex }) =>
			apiClient
				.put(`/analyses/${analysisId}/${sequenceIndex}/blast`)
				.then((res) => res.body),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: analysesQueryKeys.detail(analysisId),
			});
		},
	});
}
