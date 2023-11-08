import { useQuery } from "react-query";
import { Request } from "../app/request";

/**
 * Retrieves a list of HMM search results
 */
export function findHmms() {
    return Request.get("/hmms").then(res => res.body);
}

/**
 * Fetches a list of HMM search results from the API
 */
export function useFindHmms() {
    return useQuery("hmms", findHmms);
}
