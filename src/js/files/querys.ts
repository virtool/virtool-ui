import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { Request } from "../app/request";
import { FileResponse, FileType } from "./types";

export const fileQueryKeys = {
    all: () => ["files"] as const,
    lists: () => ["files", "list"] as const,
    list: (type: string, filters: Array<string | number | boolean>) => ["files", "list", type, ...filters] as const,
    infiniteList: (type: string, filters: Array<string | number | boolean>) =>
        ["files", "list", "infinite", type, ...filters] as const,
};

function listFiles(type: FileType, paginate: boolean, page: number) {
    return Request.get("/uploads")
        .query({ upload_type: type, paginate, page, ready: true })
        .then(response => response.body);
}

export function useListFiles(type: FileType, paginate: boolean, page = 1) {
    return useQuery(fileQueryKeys.list(type, [paginate, page]), () => listFiles(type, paginate, page), {
        keepPreviousData: true,
    });
}

function findFiles(type: FileType, page: number, per_page: number, term?: string) {
    return Request.get("/uploads")
        .query({ upload_type: type, page, per_page, ready: true, paginate: true })
        .then(response => response.body);
}

export function useInfiniteFindFiles(type: FileType, per_page: number, term?: string) {
    return useInfiniteQuery<FileResponse>(
        fileQueryKeys.infiniteList(type, [per_page]),
        ({ pageParam }) => findFiles(type, pageParam, per_page, term),
        {
            getNextPageParam: lastPage => {
                if (lastPage.page >= lastPage.page_count) {
                    return undefined;
                }
                return (lastPage.page || 1) + 1;
            },
        },
    );
}

function deleteFile(id: string) {
    return Request.delete(`/uploads/${id}`);
}

export function useDeleteFile() {
    return useMutation((id: string) => deleteFile(id));
}
