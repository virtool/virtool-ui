import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import { Request } from "../app/request";
import { AdministratorRoles } from "./types";

export const roleKeys = {
    all: () => ["roles"] as const,
};

const getAdministratorRoles = () => Request.get("/admin/roles").then(response => response.body);

export const useGetAdministratorRoles = () => {
    return useQuery("roles", getAdministratorRoles);
};

export const userKeys = {
    all: () => ["users"] as const,
    lists: () => ["users", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["users", "list", ...filters] as const,
    infiniteLists: () => ["users", "infiniteList"] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["users", "infiniteList", ...filters] as const,
    details: () => ["users", "details"] as const,
    detail: (user_id: string) => ["users", "details", user_id] as const,
};

const getUsers = (page: number, per_page: number, term: string, administrator: boolean) =>
    Request.get("/admin/users")
        .query({ page, per_page, term, administrator })
        .then(response => {
            return response.body;
        });

export const useFindUsers = (page: number, per_page: number, term: string, administrator?: boolean) => {
    return useQuery(
        userKeys.list([page, per_page, term, administrator]),
        () => getUsers(page, per_page, term, administrator),
        {
            keepPreviousData: true,
        },
    );
};

export const useInfiniteFindUsers = (per_page: number, term: string, administrator?: boolean) => {
    return useInfiniteQuery(
        userKeys.infiniteList([per_page, term, administrator]),
        ({ pageParam }) => getUsers(pageParam, per_page, term, administrator),
        {
            getNextPageParam: lastPage => {
                if (lastPage.page >= lastPage.page_count) {
                    return undefined;
                }
                return (lastPage.page || 1) + 1;
            },
        },
    );
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
