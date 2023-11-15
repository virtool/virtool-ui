import { useQuery } from "react-query";
import { listHmms } from "./api";

/**
 * Fetches a list of HMM search results from the API
 */
export function useFindHmms() {
    return useQuery("hmms", listHmms);
}
