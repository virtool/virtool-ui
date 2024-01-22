import { describe, expect, it } from "vitest";
import {
    ADD_REFERENCE_GROUP,
    ADD_REFERENCE_USER,
    CHECK_REMOTE_UPDATES,
    EDIT_REFERENCE,
    EDIT_REFERENCE_GROUP,
    EDIT_REFERENCE_USER,
    FIND_REFERENCES,
    GET_REFERENCE,
    UPDATE_REMOTE_REFERENCE,
    UPLOAD,
    WS_INSERT_REFERENCE,
    WS_REMOVE_REFERENCE,
    WS_UPDATE_REFERENCE,
} from "../../app/actionTypes";
import reducer, { initialState } from "../reducer";

describe("References Reducer", () => {
    it("should return the initial state on first pass", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual(initialState);
    });

    it("should return the given state on other action types", () => {
        const action = {
            type: "UNHANDLED_ACTION",
        };
        const result = reducer(initialState, action);
        expect(result).toEqual(initialState);
    });

    describe("should handle WS_INSERT_REFERENCE", () => {
        it("returns state if documents not yet fetched", () => {
            const state = { documents: null };
            const action = { type: WS_INSERT_REFERENCE, payload: { id: "foo" } };
            const result = reducer(state, action);
            expect(result).toEqual({ documents: [{ id: "foo" }] });
        });

        it("inserts entry into list otherwise", () => {
            const state = {
                ...initialState,
                documents: [],
                page: 1,
                fetched: true,
            };
            const action = {
                type: WS_INSERT_REFERENCE,
                payload: { id: "123abc", name: "testReference" },
            };
            const result = reducer(state, action);
            expect(result).toEqual({
                ...state,
                documents: [{ ...action.payload }],
            });
        });
    });

    it("should handle WS_UPDATE_REFERENCE", () => {
        const state = { documents: [{ id: "123abc", name: "testReference" }] };
        const action = {
            type: WS_UPDATE_REFERENCE,
            payload: { id: "123abc", name: "testReference-edited" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            documents: [{ id: "123abc", name: "testReference-edited" }],
        });
    });

    it("should handle WS_REMOVE_REFERENCE", () => {
        const state = {
            documents: [{ id: "123abc", name: "testReference" }],
        };
        const action = {
            type: WS_REMOVE_REFERENCE,
            payload: { "123abc": "123abc" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            documents: [],
        });
    });

    it("should handle FIND_REFERENCES_REQUESTED", () => {
        const term = "foo";
        const action = {
            type: FIND_REFERENCES.REQUESTED,
            payload: { term: "foo" },
        };
        const result = reducer({}, action);
        expect(result).toEqual({ term });
    });

    it("should handle FIND_REFERENCES_SUCCEEDED", () => {
        const state = { documents: null };
        const action = {
            type: FIND_REFERENCES.SUCCEEDED,
            payload: { documents: [], page: 3, page_count: 5 },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...action.payload,
        });
    });

    it("should handle GET_REFERENCE_SUCCEEDED", () => {
        const action = { type: GET_REFERENCE.SUCCEEDED, payload: { foo: "bar" } };
        const result = reducer({}, action);
        expect(result).toEqual({ detail: { foo: "bar" } });
    });

    it("should handle EDIT_REFERENCE_SUCCEEDED", () => {
        const state = { detail: { foo: "bar" } };
        const action = {
            type: EDIT_REFERENCE.SUCCEEDED,
            payload: { foo: "baz" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({ detail: { foo: "baz" } });
    });

    it("should handle UPLOAD_SUCCEEDED", () => {
        const action = { type: UPLOAD.SUCCEEDED, payload: { foo: "bar" } };
        const result = reducer({}, action);
        expect(result).toEqual({
            importFile: {
                foo: "bar",
            },
            importUploadId: null,
            importUploadName: null,
            importUploadProgress: 0,
        });
    });

    it("should handle CHECK_REMOTE_UPDATES_REQUESTED", () => {
        const action = { type: CHECK_REMOTE_UPDATES.REQUESTED };
        const result = reducer({}, action);
        expect(result).toEqual({ checking: true });
    });

    it("should handle CHECK_REMOTE_UPDATES_FAILED", () => {
        const action = { type: CHECK_REMOTE_UPDATES.FAILED };
        const result = reducer({}, action);
        expect(result).toEqual({ checking: false });
    });

    it("should handle CHECK_REMOTE_UPDATES_SUCCEEDED", () => {
        const state = { checking: true };
        const action = {
            type: CHECK_REMOTE_UPDATES.SUCCEEDED,
            payload: { foo: "bar" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            checking: false,
            detail: {
                release: { foo: "bar" },
            },
        });
    });

    it("should handle UPDATE_REMOTE_REFERENCE_SUCCEEDED", () => {
        const state = { detail: {} };
        const action = {
            type: UPDATE_REMOTE_REFERENCE.SUCCEEDED,
            payload: { foo: "bar" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({ detail: { release: { foo: "bar" } } });
    });

    it("should handle ADD_REFERENCE_USER_SUCCEEDED", () => {
        const state = { detail: { users: [] } };
        const action = {
            type: ADD_REFERENCE_USER.SUCCEEDED,
            payload: { id: "test-user" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({ detail: { users: [{ id: "test-user" }] } });
    });

    it("should handle EDIT_REFERENCE_USER_SUCCEEDED", () => {
        const state = { detail: { users: [{ id: "test-user", foo: "bar" }] } };
        const action = {
            type: EDIT_REFERENCE_USER.SUCCEEDED,
            payload: { id: "test-user", foo: "baz" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            detail: { users: [{ id: "test-user", foo: "baz" }] },
        });
    });

    it("should handle ADD_REFERENCE_GROUP_SUCCEEDED", () => {
        const state = { detail: { groups: [] } };
        const action = {
            type: ADD_REFERENCE_GROUP.SUCCEEDED,
            payload: { id: "test-group" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            detail: { groups: [{ id: "test-group" }] },
        });
    });

    it("should handle EDIT_REFERENCE_GROUP_SUCCEEDED", () => {
        const state = {
            detail: {
                groups: [{ id: "foo", foo: "bar" }],
            },
        };
        const action = {
            type: EDIT_REFERENCE_GROUP.SUCCEEDED,
            payload: { id: "foo", foo: "baz" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            detail: {
                groups: [{ id: "foo", foo: "baz" }],
            },
        });
    });
});
