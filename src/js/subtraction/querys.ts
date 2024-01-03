import { useQuery } from "react-query";
import { ErrorResponse } from "../types/types";
import { findSubtractions, getSubtraction } from "./api";
import { Subtraction, SubtractionSearchResult } from "./types";

export const subtractionQueryKeys = {
    all: () => ["subtraction"] as const,
    lists: () => ["subtraction", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["subtraction", "list", ...filters] as const,
    details: () => ["subtraction", "details"] as const,
    detail: (subtractionId: string) => ["subtraction", "details", subtractionId] as const,
};

export function useFindSubtractions(page: number, per_page: number, term: string) {
    return useQuery<SubtractionSearchResult>(
        subtractionQueryKeys.list([page, per_page, term]),
        () => findSubtractions({ page, per_page, term }),
        {
            keepPreviousData: true,
        },
    );
}

export function useFetchSubtraction(subtractionId: string) {
    return useQuery<Subtraction, ErrorResponse>(
        subtractionQueryKeys.detail(subtractionId),
        () => getSubtraction(subtractionId),
        {
            retry: (failureCount, error) => {
                if (error.response?.status === 404) {
                    return false;
                }
                return failureCount <= 3;
            },
        },
    );
}
