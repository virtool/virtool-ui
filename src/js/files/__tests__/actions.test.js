import { describe, expect, it } from "vitest";
import { REMOVE_UPLOAD, UPLOAD, UPLOAD_FAILED, UPLOAD_PROGRESS } from "../../app/actionTypes";
import { removeUpload, upload, uploadFailed, uploadProgress } from "../actions";

describe("Files Action Creators", () => {
    it("upload: returns action with file upload to server", () => {
        const localId = "random_string";
        const file = {
            id: "foo",
        };
        const fileType = "reads";
        const result = upload(localId, file, fileType);
        expect(result).toEqual({
            type: UPLOAD.REQUESTED,
            payload: { context: {}, localId, file, fileType },
        });
    });

    it("uploadProgress: returns action with upload progress", () => {
        const localId = "random_string";
        const progress = 6;
        const result = uploadProgress(localId, progress);
        expect(result).toEqual({
            type: UPLOAD_PROGRESS,
            payload: { localId, progress },
        });
    });

    it("uploadFailed: returns action with failed upload Id", () => {
        const localId = "random_string";
        const result = uploadFailed(localId);
        expect(result).toEqual({
            type: UPLOAD_FAILED,
            payload: { localId },
        });
    });
    it("removeUpload: returns Id of upload to be removed", () => {
        const localId = "random_string";
        const result = removeUpload(localId);
        expect(result).toEqual({
            type: REMOVE_UPLOAD,
            payload: { localId },
        });
    });
});
