import { useQuery } from "react-query";
import { findSubtractions, subtractionShortlist } from "./api";
import { SubtractionSearchResult } from "./types";

export const subtractionQueryKeys = {
    list: (filters: Array<string | number | boolean>) => ["subtraction", "list", ...filters] as const,
    shortlist: () => ["subtraction", "shortlist"] as const,
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

export function useSubtractionsShortlist() {
    return useQuery(subtractionQueryKeys.shortlist(), subtractionShortlist);
}
