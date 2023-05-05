import { useQuery } from "react-query";
import { Request } from "../app/request";

const getAccount = () =>
    Request.get("/api/account")
        .query()
        .then(response => {
            return response.body;
        });

export const useGetAccount = () => {
    return useQuery("account", () => getAccount());
};
