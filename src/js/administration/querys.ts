import { useMutation, useQuery, useQueryClient } from "react-query";
import { Request } from "../app/request";
import { AdministratorRoles } from "./types";

const getAdministratorRoles = () => Request.get("/api/admin/roles").then(response => response.body);

export const useGetAdministratorRoles = () => {
    return useQuery("roles", getAdministratorRoles);
};

const getUsers = (page: number, per_page: number, term: string, administrator: boolean) =>
    Request.get("/api/admin/users")
        .query({ page, per_page, term, administrator })
        .then(response => {
            return response.body;
        });

export const useGetUsers = (page: number, per_page: number, term: string, administrator: boolean) => {
    return useQuery(["users", page, term, administrator], () => getUsers(page, per_page, term, administrator), {
        keepPreviousData: true,
    });
};

const setAdministratorRole = (role: string, user_id: string) => {
    return Request.put(`/api/admin/users/${user_id}/role`).send({ role });
};

export const useSetAdministratorRole = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ role, user_id }: { role: AdministratorRoles; user_id: string }) => setAdministratorRole(role, user_id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("users");
                queryClient.invalidateQueries("detailed_user");
            },
        },
    );
};
