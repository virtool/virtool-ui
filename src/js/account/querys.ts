import { useQuery } from "react-query";
import { Request } from "../app/request";

export const accountKeys = {
    all: ["account"],
};

const getAccount = () =>
    Request.get("/account")
        .query()
        .then(response => response.body);

export const useGetAccount = () => {
    return useQuery([accountKeys.all], () => getAccount());
};
