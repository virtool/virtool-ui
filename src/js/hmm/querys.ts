import { useQuery } from "react-query";
import { listHmms } from "./api";
import { HMMSearchResults } from "./types";

/**
 * Fetches a list of HMM search results from the API
 *
 * @returns A list of HMMs
 */
export function useListHmms() {
    return useQuery<HMMSearchResults>("hmms", listHmms);
}
