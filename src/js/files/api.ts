/**
 * Functions for communication with API endpoints related to uploaded files.
 *
 * @module files/api
 */
import { Request } from "@app/request";
import { FileType } from "./types";

export function findFiles(type: FileType, page: number, per_page: number, term?: string) {
    return Request.get("/uploads")
        .query({ upload_type: type, page, per_page, ready: true, paginate: true, find: term })
        .then(response => response.body);
}
