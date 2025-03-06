/**
 * Functions for communication with API endpoints related to uploaded files.
 *
 * @module files/api
 */
import { apiClient } from "@app/apiClient";
import { FileResponse, FileType } from "./types";

export function findFiles(
    type: FileType,
    page: number,
    per_page: number,
    term?: string,
): Promise<FileResponse> {
    return apiClient
        .get("/uploads")
        .query({
            upload_type: type,
            page,
            per_page,
            ready: true,
            paginate: true,
            find: term,
        })
        .then((res) => res.body);
}

export function removeFile(id: string): Promise<null> {
    return apiClient.delete(`/uploads/${id}`).then((res) => res.body);
}
