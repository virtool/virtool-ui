import { useQuery } from "react-query";
import { Request } from "../app/request";
import { Account } from "./types";

export const accountKeys = {
    all: () => ["account"],
};

const getAccount = () =>
    Request.get("/account")
        .query()
        .then(response => response.body);

/**
 * Asynchronously fetches account data
 *
 * @returns {UseQueryResult<Account>}
 */
export const useFetchAccount = () => {
    return useQuery<Account>([accountKeys.all], () => getAccount());
};
