import { useMutation, useQuery, useQueryClient } from "react-query";
import { Request } from "../app/request";
import { AdministratorRoles } from "./types";

export const roleKeys = {
    all: ["roles"] as const,
};

const getAdministratorRoles = () => Request.get("/admin/roles").then(response => response.body);

export const useGetAdministratorRoles = () => {
    return useQuery("roles", getAdministratorRoles);
};

export const userKeys = {
    all: ["users"] as const,
    lists: () => [...userKeys.all, "list"] as const,
    list: (filters: Array<string | number | boolean>) => [...userKeys.lists(), ...filters] as const,
    details: () => [...userKeys.all, "details"] as const,
    detail: (user_id: string) => [...userKeys.details(), user_id] as const,
};

const getUsers = (page: number, per_page: number, term: string, administrator: boolean) =>
    Request.get("/admin/users")
        .query({ page, per_page, term, administrator })
        .then(response => {
            return response.body;
        });

export const useGetUsers = (page: number, per_page: number, term: string, administrator: boolean) => {
    return useQuery(userKeys.list([page, term, administrator]), () => getUsers(page, per_page, term, administrator), {
        keepPreviousData: true,
    });
};

const setAdministratorRole = (role: string, user_id: string) => {
    return Request.put(`/admin/users/${user_id}/role`).send({ role });
};

export const useSetAdministratorRole = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ role, user_id }: { role: AdministratorRoles; user_id: string }) => setAdministratorRole(role, user_id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(userKeys.all);
            },
        },
    );
};
