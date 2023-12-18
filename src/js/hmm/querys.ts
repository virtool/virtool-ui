import { useQuery } from "react-query";
import { listHmms } from "./api";
import { HMMSearchResults } from "./types";

/**
 * Factory object for generating hmm query keys
 */
export const hmmQueryKeys = {
    all: () => ["hmm"] as const,
    lists: () => ["hmm", "list"] as const,
    list: (filters: Array<string | number | boolean | string[]>) => ["hmm", "list", ...filters] as const,
};

/**
 * Fetch a page of hmm search results from the API
 *
 * @param page - The page to fetch
 * @param per_page - The number of hmms to fetch per page
 * @param term - The search term to filter the hmms by
 * @returns A page of hmms search results
 */
export function useListHmms(page: number, per_page: number, term?: string) {
    return useQuery<HMMSearchResults>(hmmQueryKeys.list([page, per_page, term]), () => listHmms(page, per_page, term), {
        keepPreviousData: true,
    });
}
