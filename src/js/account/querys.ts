import { useQuery } from "react-query";
import { Request } from "../app/request";

const getAccount = () =>
    Request.get("/account")
        .query()
        .then(response => response.body);

export const useGetAccount = () => {
    return useQuery("account", () => getAccount());
};
