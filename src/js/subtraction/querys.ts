import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorResponse } from "../types/types";
import {
    createSubtraction,
    fetchSubtractionShortlist,
    findSubtractions,
    getSubtraction,
    removeSubtraction,
    updateSubtraction,
} from "./api";
import { Subtraction, SubtractionSearchResult, SubtractionShortlist } from "./types";

/**
 * Factory object for generating subtraction query keys
 */
export const subtractionQueryKeys = {
    all: () => ["subtraction"] as const,
    lists: () => ["subtraction", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["subtraction", "list", ...filters] as const,
    details: () => ["subtraction", "details"] as const,
    detail: (subtractionId: string) => ["subtraction", "details", subtractionId] as const,
    shortlist: () => ["subtraction", "list", "short"] as const,
};

/**
 * Initializes a mutator for creating a subtraction
 *
 * @returns A mutator for creating a subtraction
 */
export function useCreateSubtraction() {
    return useMutation<Subtraction, unknown, { name: string; nickname: string; uploadId: string }>(
        ({ name, nickname, uploadId }) => createSubtraction(name, nickname, uploadId),
    );
}

/**
 * Fetch a page of subtraction search results from the API
 *
 * @param page - The page to fetch
 * @param per_page - The number of hmms to fetch per page
 * @param term - The search term to filter the hmms by
 * @returns A page of subtraction search results
 */
export function useFindSubtractions(page: number, per_page: number, term: string) {
    return useQuery<SubtractionSearchResult>(
        subtractionQueryKeys.list([page, per_page, term]),
        () => findSubtractions(page, per_page, term),
        {
            keepPreviousData: true,
        },
    );
}

/**
 * Fetches a single subtraction
 *
 * @param subtractionId - The id of the subtraction to fetch
 * @returns A single subtraction
 */
export function useFetchSubtraction(subtractionId: string) {
    return useQuery<Subtraction, ErrorResponse>(subtractionQueryKeys.detail(subtractionId), () =>
        getSubtraction(subtractionId),
    );
}

/**
 * Initializes a mutator for updating a subtraction
 *
 * @param subtractionId - The id of the subtraction to update
 * @returns A mutator for updating a subtraction
 */
export function useUpdateSubtraction(subtractionId: string) {
    const queryClient = useQueryClient();
    return useMutation<Subtraction, unknown, { name: string; nickname: string }>(
        ({ name, nickname }) => updateSubtraction(subtractionId, name, nickname),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(subtractionQueryKeys.detail(subtractionId));
            },
        },
    );
}

/**
 * Initializes a mutator for removing a subtraction
 *
 * @returns A mutator for removing a subtraction
 */
export function useRemoveSubtraction() {
    return useMutation<Response, unknown, { subtractionId: string }>(({ subtractionId }) =>
        removeSubtraction(subtractionId),
    );
}

/**
 * Fetches a list of subtractions with reduced information
 *
 * @param ready - Indicates whether to show all the ready subtractions
 * @returns A list of subtractions
 */
export function useFetchSubtractionsShortlist(ready?: boolean) {
    return useQuery<SubtractionShortlist[]>(subtractionQueryKeys.shortlist(), () => fetchSubtractionShortlist(ready));
}
