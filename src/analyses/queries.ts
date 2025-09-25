import { ErrorResponse } from "@/types/api";
import { samplesQueryKeys } from "@samples/queries";
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
import {
    blastNuvs,
    createAnalysis,
    getAnalysis,
    listAnalyses,
    removeAnalysis,
} from "./api";
import { Analysis, AnalysisSearchResult, GenericAnalysis } from "./types";
import { formatData } from "./utils";

/**
 * Factory object for generating analyses query keys
 */
export const analysesQueryKeys = {
    all: () => ["analyses"] as const,
    lists: () => ["analyses", "list"] as const,
    list: (filters: Array<string | number | boolean | string[]>) =>
        ["analyses", "list", ...filters] as const,
    details: () => ["analyses", "details"] as const,
    detail: (analysesId: string) =>
        ["analyses", "details", analysesId] as const,
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
export function useListAnalyses(
    sampleId: string,
    page: number,
    per_page: number,
    term?: string,
) {
    return useQuery<AnalysisSearchResult>({
        queryKey: analysesQueryKeys.list([sampleId, page, per_page, term]),
        queryFn: () => listAnalyses(sampleId, page, per_page, term),
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
        mutationFn: ({ analysisId }) => removeAnalysis(analysisId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: analysesQueryKeys.lists(),
            });
        },
    });

    return () => mutation.mutate({ analysisId });
}

/**
 * Fetch complete information for a single analysis
 *
 * @param analysisId - The id of the analysis to fetch
 * @returns A complete analysis
 */
export function useGetAnalysis(analysisId: string) {
    const queryResult = useQuery<Analysis, ErrorResponse>({
        queryKey: analysesQueryKeys.detail(analysisId),
        queryFn: () => getAnalysis({ analysisId }),
    });
    return useMemo(
        () => ({
            ...queryResult,
            data: formatData(queryResult.data) as Analysis,
        }),
        [queryResult],
    );
}

export type CreateAnalysisParams = {
    mlModel?: string;
    refId?: string;
    sampleId: string;
    subtractionIds?: string[];
    workflow: string;
};

export function useCreateAnalysis() {
    const queryClient = useQueryClient();

    return useMutation<GenericAnalysis, unknown, CreateAnalysisParams>({
        mutationFn: ({ mlModel, refId, sampleId, subtractionIds, workflow }) =>
            createAnalysis(mlModel, refId, sampleId, subtractionIds, workflow),

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
        mutationFn: ({ sequenceIndex }) => blastNuvs(analysisId, sequenceIndex),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: analysesQueryKeys.detail(analysisId),
            });
        },
    });
}
