import { useMutation, useQuery } from "react-query";
import { Request } from "../app/request";
import { FileType } from "./types";

export const fileKeys = {
    all: ["files"] as const,
    lists: () => [...fileKeys.all, "list"] as const,
    list: (type: string, filters: Array<string | number | boolean>) => [...fileKeys.lists(), type, ...filters] as const,
};

const listFiles = (type: FileType, paginate: boolean, page: number) =>
    Request.get("/uploads")
        .query({ upload_type: type, paginate, page, ready: true })
        .then(response => response.body);

export const useListFiles = (type: FileType, paginate: boolean, page: number = 1) => {
    return useQuery(fileKeys.list(type, [paginate, page]), () => listFiles(type, paginate, page), {
        keepPreviousData: true,
    });
};

const deleteFile = (id: string) => Request.delete(`/uploads/${id}`);

export const useDeleteFile = () => {
    return useMutation((id: string) => deleteFile(id));
};
