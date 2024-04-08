import { Request } from "@app/request";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { findFiles } from "./api";
import { FileResponse, FileType } from "./types";

export const fileQueryKeys = {
    all: () => ["files"] as const,
    lists: () => ["files", "list"] as const,
    list: (type: string, filters: Array<string | number | boolean>) => ["files", "list", type, ...filters] as const,
    infiniteList: (type: string, filters: Array<string | number | boolean>) =>
        ["files", "list", "infinite", type, ...filters] as const,
};

export function useListFiles(type: FileType, page = 1, per_page: number) {
    return useQuery(fileQueryKeys.list(type, [page, per_page]), () => findFiles(type, page, per_page), {
        keepPreviousData: true,
    });
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
