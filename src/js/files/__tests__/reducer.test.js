import {
    WS_INSERT_FILE,
    WS_UPDATE_FILE,
    WS_REMOVE_FILE,
    UPLOAD,
    UPLOAD_PROGRESS,
    FIND_FILES,
    UPLOAD_FAILED,
    REMOVE_UPLOAD
} from "../../app/actionTypes";
import reducer, { initialState } from "../reducer";

describe("filesReducer()", () => {
    it("should return the initial state on first pass", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual(initialState);
    });

    it("should handle WS_UPDATE_FILE", () => {
        const state = {
            documents: [{ id: "test", foo: "bar" }]
        };
        const action = {
            type: WS_UPDATE_FILE,
            payload: { id: "test", foo: "not-bar" }
        };
        const result = reducer(state, action);
        expect(result).toEqual({ ...state, documents: [action.payload] });
    });

    it("should handle LIST_FILES_REQUESTED", () => {
        const state = { items: [], fileType: "test_filetype" };
        const action = {
            type: FIND_FILES.REQUESTED,
            payload: { term: "foo", paginate: true, fileType: "test_filetype" }
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            term: "foo",
            paginate: true
        });
    });

    it("should handle LIST_FILES_SUCCEEDED", () => {
        const state = { items: [], page: 1 };
        const action = {
            type: FIND_FILES.SUCCEEDED,
            payload: { items: [] },
            context: { fileType: "test" }
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            ...action.payload,
            fileType: "test"
        });
    });

    it("should handle UPLOAD_REQUESTED", () => {
        const localId = "baz";
        const name = "test.fq.gz";
        const size = 100;
        const type = "foo";
        const context = {
            foo: "bar"
        };

        const state = {
            uploads: []
        };

        const action = {
            type: UPLOAD.REQUESTED,
            payload: {
                localId,
                context,
                fileType: type,
                file: {
                    name,
                    size
                }
            }
        };

        const result = reducer(state, action);

        expect(result).toEqual({
            uploads: [...state.uploads, { localId, name, context, size, type, progress: 0, failed: false }]
        });
    });

    describe("should handle UPLOAD_PROGRESS", () => {
        let state;

        beforeEach(() => {
            state = {
                uploads: [
                    { localId: "foo", progress: 50 },
                    { localId: "bar", progress: 0 },
                    { localId: "baz", progress: 100 }
                ]
            };
        });

        it("when there are no uploads", () => {
            state.uploads = [];
            const action = {
                type: UPLOAD_PROGRESS,
                payload: { localId: "foo", progress: 5 }
            };
            expect(reducer(state, action)).toEqual({
                uploads: []
            });
        });

        it("when a zero-progress upload is updated", () => {
            const action = {
                type: UPLOAD_PROGRESS,
                payload: { localId: "bar", progress: 22 }
            };
            const result = reducer(state, action);
            expect(result).toEqual({
                uploads: [
                    { localId: "foo", progress: 50 },
                    { localId: "bar", progress: 22 },
                    { localId: "baz", progress: 100 }
                ]
            });
        });

        it("when a partial upload is updated", () => {
            const action = {
                type: UPLOAD_PROGRESS,
                payload: { localId: "foo", progress: 65 }
            };
            const result = reducer(state, action);
            expect(result).toEqual({
                uploads: [
                    { localId: "foo", progress: 65 },
                    { localId: "bar", progress: 0 },
                    { localId: "baz", progress: 100 }
                ]
            });
        });

        it("when an update that brings a progress value to 100", () => {
            const action = {
                type: UPLOAD_PROGRESS,
                payload: { localId: "foo", progress: 100 }
            };
            const result = reducer(state, action);
            expect(result).toEqual({
                uploads: [
                    { localId: "foo", progress: 100 },
                    { localId: "bar", progress: 0 },
                    { localId: "baz", progress: 100 }
                ]
            });
        });
    });

    it("should remove upload when it successfully finishes", () => {
        const state = {
            uploads: [
                { localId: "foo", progress: 50 },
                { localId: "bar", progress: 0 },
                { localId: "baz", progress: 100 }
            ]
        };
        const action = {
            type: UPLOAD.SUCCEEDED,
            payload: { localId: "foo", progress: 100 }
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            uploads: [
                { localId: "bar", progress: 0 },
                { localId: "baz", progress: 100 }
            ]
        });
    });

    it("should update status of upload to failed when required", () => {
        const state = {
            uploads: [
                { localId: "foo", progress: 50 },
                { localId: "bar", progress: 0 },
                { localId: "baz", progress: 100 }
            ]
        };
        const action = {
            type: UPLOAD_FAILED,
            payload: { localId: "foo" }
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            uploads: [
                { localId: "foo", progress: 50, failed: true },
                { localId: "bar", progress: 0 },
                { localId: "baz", progress: 100 }
            ]
        });
    });

    it("should remove upload when requested", () => {
        const state = {
            uploads: [
                { localId: "foo", progress: 50 },
                { localId: "bar", progress: 0 },
                { localId: "baz", progress: 100 }
            ]
        };
        const action = {
            type: REMOVE_UPLOAD,
            payload: { localId: "foo" }
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            uploads: [
                { localId: "bar", progress: 0 },
                { localId: "baz", progress: 100 }
            ]
        });
    });
});
