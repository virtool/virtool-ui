import { useMutation, useQuery, useQueryClient } from "react-query";
import { Request } from "../app/request";
import { groupNameUpdate } from "./types";

export const groupKeys = {
    all: () => ["groups"] as const,
    lists: () => ["groups", "list"] as const,
    list: filters => ["groups", "list", ...filters] as const,
    details: () => ["groups", "details"] as const,
    detail: id => ["groups", "detail", id] as const,
};

function listGroups() {
    return Request.get("/groups").then(response => response.body);
}

export function useListGroups() {
    return useQuery(groupKeys.lists(), listGroups);
}

function getGroup(id) {
    return Request.get(`/groups/${id}`).then(response => response.body);
}

export function useGetGroup(id, options) {
    return useQuery(groupKeys.detail(id), () => getGroup(id), options);
}

export function setName({ id, name }: groupNameUpdate) {
    return Request.patch(`/groups/${id}`)
        .send({
            name,
        })
        .then(response => response.body);
}

export function useSetName() {
    const queryClient = useQueryClient();
    return useMutation(setName, {
        onSuccess: data => {
            queryClient.invalidateQueries(groupKeys.lists());
            queryClient.setQueryData(groupKeys.detail(data.id), data);
        },
    });
}

function setPermission({ id, permission, value }) {
    return Request.patch(`/groups/${id}`)
        .send({
            permissions: {
                [permission]: value,
            },
        })
        .then(response => response.body);
}

export function useSetPermission() {
    const queryClient = useQueryClient();
    return useMutation(setPermission, {
        onSuccess: data => {
            queryClient.setQueryData(groupKeys.detail(data.id), data);
        },
    });
}

function removeGroup({ id }) {
    return Request.delete(`/groups/${id}`);
}

export function useRemoveGroup() {
    const queryClient = useQueryClient();
    return useMutation(removeGroup, {
        onSuccess: data => {
            queryClient.invalidateQueries(groupKeys.all());
        },
    });
}

function createGroup({ name }) {
    return Request.post(`/groups`)
        .send({
            name,
        })
        .then(response => response.body);
}

export function useCreateGroup(options) {
    const queryClient = useQueryClient();
    return useMutation(createGroup, {
        onSuccess: () => {
            queryClient.invalidateQueries(groupKeys.lists());
        },
        ...options,
    });
}
