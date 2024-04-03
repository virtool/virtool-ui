import { formatData } from "@/analyses/utils";
import { ErrorResponse } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { samplesQueryKeys } from "../samples/queries";
import { createAnalysis, getAnalysis, listAnalyses, removeAnalysis } from "./api";
import { Analysis, AnalysisSearchResult, GenericAnalysis } from "./types";

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

/**
 * Fetch complete information for a single analysis
 *
 * @param analysisId - The id of the analysis to fetch
 * @returns A complete analysis
 */
export function useGetAnalysis(analysisId: string) {
    const queryResult = useQuery<Analysis, ErrorResponse>(analysesQueryKeys.detail(analysisId), () =>
        getAnalysis({ analysisId }),
    );
    return useMemo(
        () => ({ ...queryResult, data: formatData(queryResult.data) as Analysis }),
        [queryResult.data, queryResult.error],
    );
}

export type CreateAnalysisParams = {
    mlModel?: string;
    refId: string;
    sampleId: string;
    subtractionIds?: string[];
    workflow: string;
};

export function useCreateAnalysis() {
    const queryClient = useQueryClient();

    const mutation = useMutation<GenericAnalysis, unknown, CreateAnalysisParams>(
        ({ mlModel, refId, sampleId, subtractionIds, workflow }) =>
            createAnalysis(mlModel, refId, sampleId, subtractionIds, workflow),
        {
            onSuccess: () => {
                void queryClient.invalidateQueries(analysesQueryKeys.lists());
                void queryClient.invalidateQueries(samplesQueryKeys.lists());
            },
        },
    );

    return mutation;
}
