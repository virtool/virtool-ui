import { useMutation, useQuery, useQueryClient } from "react-query";
import { createAnalysis, listAnalyses, removeAnalysis } from "./api";
import { Analysis, AnalysisSearchResult } from "./types";

/**
 * Factory object for generating analyses query keys
 */
export const analysesQueryKeys = {
    all: () => ["analyses"] as const,
    lists: () => ["analyses", "list"] as const,
    list: (filters: Array<string | number | boolean | string[]>) => ["analyses", "list", ...filters] as const,
    details: () => ["analyses", "details"] as const,
    detail: (analysesId: string) => ["analyses", "details", analysesId] as const,
};

/**
 * Fetch a page of analyses search results from the API
 *
 * @param sampleId - The sample which the analyses are associated with
 * @param page - The page to fetch
 * @param per_page - The number of analyses to fetch per page
 * @param term - The search term to filter the analyses by
 * @returns A page of analyses search results
 */
export function useListAnalyses(sampleId: string, page: number, per_page: number, term?: string) {
    return useQuery<AnalysisSearchResult>(
        analysesQueryKeys.list([sampleId, page, per_page, term]),
        () => listAnalyses(sampleId, page, per_page, term),
        {
            keepPreviousData: true,
        },
    );
}

/**
 * Initializes a mutator for removing an analysis
 *
 * @param analysisId - The id of the analysis to remove
 * @returns A mutator for removing an analysis
 */
export function useRemoveAnalysis(analysisId: string) {
    const queryClient = useQueryClient();

    const mutation = useMutation<null, unknown, { analysisId: string }>(
        ({ analysisId }) => removeAnalysis(analysisId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(analysesQueryKeys.lists());
            },
        },
    );

    return () => mutation.mutate({ analysisId });
}

type createAnalysisMutationParams = {
    sampleId: string;
    refId: string;
    subtractionIds: string[];
    workflow: string;
    mlModel: string;
};

export function useCreateAnalysis() {
    const queryClient = useQueryClient();

    const mutation = useMutation<Analysis, unknown, createAnalysisMutationParams>(
        ({ sampleId, refId, subtractionIds, workflow, mlModel }) =>
            createAnalysis(sampleId, refId, subtractionIds, workflow, mlModel),
        {
            onSuccess: () => {
                void queryClient.invalidateQueries(analysesQueryKeys.lists());
            },
        },
    );

    return mutation;
}
