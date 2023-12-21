/**
 * Functions for communication with API endpoints related to uploaded files.
 *
 * @module files/api
 */
import { Request } from "../app/request";
import { FileType } from "./types";

/**
 * Upload a ``file`` with the given ``fileType``. Pass progress events to ``onProgress``.
 *
 * @func
 * @param file {object} the file object to upload
 * @param fileType {string} the file type to assign to the uploaded file
 * @param onProgress {function} a callback to call with ``ProgressEvent``s when they are fired
 * @param onSuccess {function} a callback to call when the upload succeeds
 * @param onFailure {function} a callback to call when the upload fails
 * @returns {promise}
 */
export function upload({ file, fileType, onProgress, onSuccess, onFailure }) {
    return Request.post("/uploads")
        .query({ name: file.name, type: fileType })
        .attach("file", file)
        .on("progress", onProgress)
        .then(onSuccess)
        .catch(onFailure);
}

export function findFiles(type: FileType, page: number, per_page: number, term?: string) {
    return Request.get("/uploads")
        .query({ upload_type: type, page, per_page, ready: true, paginate: true, find: term })
        .then(response => response.body);
}
