import { useQuery } from "react-query";
import { listHmms } from "./api";
import { HMMSearchResults } from "./types";

/**
 * Fetches a list of HMM search results from the API
 */
export function useFindHmms() {
    return useQuery<HMMSearchResults>("hmms", listHmms);
}
