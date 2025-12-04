import { ErrorResponse } from "@/types/api";
import {
    keepPreviousData,
    useInfiniteQuery,
    useMutation,
    useQuery,
} from "@tanstack/react-query";
import { findFiles, removeFile } from "./api";
import { FileResponse, UploadType } from "./types";

export const fileQueryKeys = {
    all: () => ["files"] as const,
    lists: () => ["files", "list"] as const,
    list: (type: string, filters: Array<string | number | boolean>) =>
        ["files", "list", type, ...filters] as const,
    infiniteList: (type: string, filters: Array<string | number | boolean>) =>
        ["files", "list", "infinite", type, ...filters] as const,
};

export function useListFiles(type: UploadType, page, per_page: number) {
    return useQuery<FileResponse, ErrorResponse>({
        queryKey: fileQueryKeys.list(type, [page, per_page]),
        queryFn: () => findFiles(type, page, per_page),
        placeholderData: keepPreviousData,
    });
}

export function useInfiniteFindFiles(
    type: UploadType,
    per_page: number,
    term?: string,
) {
    return useInfiniteQuery<FileResponse>({
        queryKey: fileQueryKeys.infiniteList(type, [per_page]),
        queryFn: ({ pageParam }) =>
            findFiles(type, pageParam as number, per_page, term),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page >= lastPage.page_count) {
                return undefined;
            }
            return (lastPage.page || 1) + 1;
        },
    });
}

/**
 * Initializes a mutator for deleting a file
 *
 * @returns A mutator for deleting a file
 */
export function useDeleteFile() {
    return useMutation<null, unknown, { id: number }>({
        mutationFn: ({ id }) => removeFile(id),
    });
}
