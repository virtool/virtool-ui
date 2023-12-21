/**
 * Functions for communication with API endpoints related to managing HMMs.
 *
 * @module hmm/api
 */
import { Request } from "../app/request";
import { HMM, HMMSearchResults } from "./types";

/**
 * Fetch a page of HMM search results from the API.
 *
 * @param term - search term to filter results by
 * @param page - page number to return
 * @returns The promise which resolves to a page of HMM search results
 */
export function find({ term, page }: { term: string; page: number }): Promise<any> {
    return Request.get("/hmms").query({ find: term, page });
}

/**
 * Initiate HMM installation.
 *
 * @returns The promise which resolves to the servers response
 */
export function install(): Promise<any> {
    return Request.post("/hmms/status/updates");
}

/**
 * Fetch a single complete HMM.
 *
 * @param hmmId - the unique id for the HMM to fetch
 * @returns resolves to an object containing a single HMM
 */
export function fetchHmm(hmmId: string): Promise<HMM> {
    return Request.get(`/hmms/${hmmId}`).then(res => res.body);
}

/**
 * Fetch a page of hmm search results
 *
 * @param page - The page to fetch
 * @param per_page -The number of hmms to fetch per page
 * @param term - The search term to filter the hmms by
 * @returns A promise resolving to a page of hmm search results
 */
export function listHmms(page: number, per_page: number, term: string): Promise<HMMSearchResults> {
    return Request.get("/hmms")
        .query({ page, per_page, find: term })
        .then(res => res.body);
}
