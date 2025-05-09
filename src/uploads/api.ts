/**
 * Functions for communication with API endpoints related to uploaded uploads.
 *
 * @module files/api
 */
import { apiClient } from "../app/api";
import { FileResponse, UploadType } from "./types";

export function findFiles(
    type: UploadType,
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
