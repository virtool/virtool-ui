import { useQuery } from "@tanstack/react-query";
import { Response } from "superagent";
import { fetchAccount, getAPIKeys } from "./api";
import { Account } from "./types";

/**
 * Factory object for generating account query keys
 */
export const accountKeys = {
    all: () => ["account"],
};

/**
 * Fetches account data for the logged-in user
 *
 * @returns UseQueryResult object containing the account data
 */
export const useFetchAccount = () => {
    return useQuery<Account>(accountKeys.all(), () => fetchAccount());
};

/**
 * Fetches the API keys for the logged-in user
 *
 * @returns
 */
export function useFetchAPIKeys() {
    return useQuery<Response>(accountKeys.all(), () => getAPIKeys());
}
