import {
    WS_INSERT_FILE,
    WS_UPDATE_FILE,
    WS_REMOVE_FILE,
    UPLOAD,
    UPLOAD_PROGRESS,
    FIND_FILES
} from "../../app/actionTypes";
import reducer, { initialState } from "../reducer";

describe("filesReducer()", () => {
    it("should return the initial state on first pass", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual(initialState);
    });

    describe("should handle WS_INSERT_FILE", () => {
        it("if list is empty or fileType doesn't match, return state", () => {
            const state = { fileType: "reads" };
            const action = {
                type: WS_INSERT_FILE,
                payload: { type: "subtraction" }
            };
            const result = reducer(state, action);
            expect(result).toEqual(state);
        });

        it("otherwise insert entry into list", () => {
            const state = {
                fetched: true,
                fileType: "reads",
                documents: [],
                page: 1,
                per_page: 3,
                total_count: 0
            };
            const action = {
                type: WS_INSERT_FILE,
                payload: { type: "reads", id: "test" }
            };
            const result = reducer(state, action);
            expect(result).toEqual({ ...state, documents: [action.payload], total_count: 0 });
        });
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

    it("should handle WS_REMOVE_FILE", () => {
        const state = {
            documents: [{ id: "test", foo: "bar" }],
            total_count: 1
        };
        const action = {
            type: WS_REMOVE_FILE,
            payload: ["test"]
        };
        const result = reducer(state, action);
        expect(result).toEqual({ documents: [], total_count: 1 });
    });

    it("should handle LIST_FILES_REQUESTED", () => {
        const state = {};
        const action = {
            type: FIND_FILES.REQUESTED,
            payload: { term: "foo", page: 5 }
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            term: "foo",
            fileType: ""
        });
    });

    it("should handle LIST_FILES_SUCCEEDED", () => {
        const state = { documents: [], page: 1 };
        const action = {
            type: FIND_FILES.SUCCEEDED,
            payload: { documents: [] },
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
            uploads: [...state.uploads, { localId, name, context, size, type, progress: 0 }]
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
});
