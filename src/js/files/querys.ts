import { useMutation, useQuery } from "react-query";
import { Request } from "../app/request";
import { FileType } from "./types";

export const fileQueryKeys = {
    all: () => ["files"] as const,
    lists: () => ["files", "list"] as const,
    list: (type: string, filters: Array<string | number | boolean>) => ["files", "list", type, ...filters] as const,
};

function listFiles(type: FileType, paginate: boolean, page: number) {
    return Request.get("/uploads")
        .query({ upload_type: type, paginate, page, ready: true })
        .then(response => response.body);
}

export function useListFiles(type: FileType, paginate: boolean, page: number = 1) {
    return useQuery(fileQueryKeys.list(type, [paginate, page]), () => listFiles(type, paginate, page), {
        keepPreviousData: true,
    });
}

function deleteFile(id: string) {
    return Request.delete(`/uploads/${id}`);
}

export function useDeleteFile() {
    return useMutation((id: string) => deleteFile(id));
}
