import { analysesQueryKeys } from "@analyses/keys";
import { apiClient } from "@app/api";
import { samplesQueryKeys } from "@samples/keys";
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
	sampleId: number,
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
export function useRemoveAnalysis(analysisId: number) {
	const queryClient = useQueryClient();

	const mutation = useMutation<null, unknown, { analysisId: number }>({
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

export function analysisQueryOptions(analysisId: number) {
	return queryOptions<Analysis, ErrorResponse>({
		queryKey: analysesQueryKeys.detail(analysisId),
		queryFn: async () => {
			const response = await apiClient.get(`/analyses/${analysisId}`);
			return response.body;
		},
	});
}

export function useGetAnalysis(analysisId: number) {
	return useQuery({
		...analysisQueryOptions(analysisId),
		select: formatData,
	});
}

export type CreateAnalysisParams = {
	refId?: number;
	sampleId: number;
	subtractionIds?: number[];
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

		onSuccess: (_data, { sampleId }) => {
			// Only this sample's analyses list gained a row, so leave every other
			// sample's analyses alone.
			queryClient.invalidateQueries({
				queryKey: [...analysesQueryKeys.lists(), sampleId],
			});
			// The sample's workflow state changed, and the samples-list row renders
			// `sample.workflows` from its own list entry — so a Quick Analyze
			// started from that list would otherwise keep showing stale workflow
			// tags until a remount. The sample's detail cache is refreshed by the
			// SSE `samples/update` frame, not here.
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
export function useBlastNuvs(analysisId: number) {
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
