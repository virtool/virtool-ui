import {
    FIND_FILES,
    REMOVE_FILE,
    REMOVE_UPLOAD,
    UPLOAD,
    UPLOAD_FAILED,
    UPLOAD_PROGRESS,
    WS_INSERT_FILE,
    WS_REMOVE_FILE,
    WS_UPDATE_FILE
} from "../../app/actionTypes";
import {
    findFiles,
    removeFile,
    removeUpload,
    upload,
    uploadFailed,
    uploadProgress,
    wsInsertFile,
    wsRemoveFile,
    wsUpdateFile
} from "../actions";

describe("Files Action Creators", () => {
    it("wsInsertFile: returns action with websocket file insert data", () => {
        const data = {
            id: "foo"
        };

        const result = wsInsertFile(data);

        expect(result).toEqual({
            type: WS_INSERT_FILE,
            payload: { ...data }
        });
    });

    it("wsUpdateFile: returns action with websocket file update data", () => {
        const data = {
            id: "foo"
        };

        const result = wsUpdateFile(data);

        expect(result).toEqual({
            type: WS_UPDATE_FILE,
            payload: { ...data }
        });
    });

    it("wsRemoveFile: returns action with websocket file remove data", () => {
        const data = ["foo", "bar"];
        const result = wsRemoveFile(data);

        expect(result).toEqual({
            type: WS_REMOVE_FILE,
            payload: { ...data }
        });
    });

    it("findFiles: returns action with find file documents", () => {
        const fileType = "reads";
        const term = "foo";
        const page = 3;
        const paginate = false;
        const result = findFiles(fileType, term, paginate, page);
        expect(result).toEqual({
            type: FIND_FILES.REQUESTED,
            payload: { fileType, term, paginate, page }
        });
    });

    it("upload: returns action with file upload to server", () => {
        const localId = "random_string";
        const file = {
            id: "foo"
        };
        const fileType = "reads";
        const result = upload(localId, file, fileType);
        expect(result).toEqual({
            type: UPLOAD.REQUESTED,
            payload: { context: {}, localId, file, fileType }
        });
    });

    it("removeFile: returns action with file remove", () => {
        const fileId = "foo";
        const result = removeFile(fileId);
        expect(result).toEqual({
            type: REMOVE_FILE.REQUESTED,
            payload: { fileId }
        });
    });
    it("uploadProgress: returns action with upload progress", () => {
        const localId = "random_string";
        const progress = 6;
        const result = uploadProgress(localId, progress);
        expect(result).toEqual({
            type: UPLOAD_PROGRESS,
            payload: { localId, progress }
        });
    });

    it("uploadFailed: returns action with failed upload Id", () => {
        const localId = "random_string";
        const result = uploadFailed(localId);
        expect(result).toEqual({
            type: UPLOAD_FAILED,
            payload: { localId }
        });
    });
    it("removeUpload: returns Id of upload to be removed", () => {
        const localId = "random_string";
        const result = removeUpload(localId);
        expect(result).toEqual({
            type: REMOVE_UPLOAD,
            payload: { localId }
        });
    });
});
