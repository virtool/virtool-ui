import { describe, expect, it } from "vitest";
import {
    DESELECT_SAMPLES,
    FIND_SAMPLES,
    GET_SAMPLE,
    REMOVE_SAMPLE,
    SELECT_SAMPLE,
    UPDATE_SAMPLE,
    UPDATE_SAMPLE_RIGHTS,
    WS_INSERT_SAMPLE,
    WS_REMOVE_SAMPLE,
    WS_UPDATE_SAMPLE,
} from "../../app/actionTypes";
import reducer, { initialState } from "../reducer";

describe("Samples Reducer", () => {
    it("should return initial state on first call", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual(initialState);
    });

    it("should return the current state for unhandled actions", () => {
        const action = { type: "UNHANDLED_ACTION" };
        const result = reducer(initialState, action);
        expect(result).toEqual(initialState);
    });

    it.each([null, []])("should handle WS_INSERT_SAMPLE and when when [documents=%p]", existing => {
        const action = {
            type: WS_INSERT_SAMPLE,
            payload: {
                id: "foo",
                name: "Foo",
            },
        };
        const state = { documents: existing };
        const result = reducer(state, action);
        expect(result).toEqual({
            documents: [action.payload],
        });
    });

    it("should handle WS_UPDATE_SAMPLE", () => {
        const state = {
            ...initialState,
            documents: [{ id: "foo", name: "Old" }],
        };
        const action = {
            type: WS_UPDATE_SAMPLE,
            payload: {
                id: "foo",
                name: "New",
            },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            documents: [{ id: "foo", name: "New" }],
        });
    });

    it("should handle WS_REMOVE_SAMPLE", () => {
        const state = {
            ...initialState,
            documents: [{ id: "foo", name: "test" }],
        };
        const action = {
            type: WS_REMOVE_SAMPLE,
            payload: ["foo"],
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            documents: [],
        });
    });

    it("should handle FIND_SAMPLES_REQUESTED", () => {
        const term = "foo";
        const action = {
            type: FIND_SAMPLES.REQUESTED,
            payload: { term, page: 5 },
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            term,
        });
    });

    it("should handle FIND_SAMPLES_SUCCEEDED", () => {
        const action = {
            type: FIND_SAMPLES.SUCCEEDED,
            payload: { documents: [], page: 5 },
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            documents: [],
            page: 5,
        });
    });

    it("should handle GET_SAMPLE_REQUESTED", () => {
        const action = {
            type: GET_SAMPLE.REQUESTED,
            sampleId: "test",
        };
        const result = reducer(initialState, action);
        expect(result).toEqual({
            ...initialState,
            detail: null,
        });
    });

    it("should handle GET_SAMPLE_SUCCEEDED", () => {
        const action = {
            type: GET_SAMPLE.SUCCEEDED,
            payload: {
                id: "123abc",
                name: "test",
            },
        };
        const result = reducer(initialState, action);
        expect(result).toEqual({
            ...initialState,
            detail: action.payload,
        });
    });

    it("should handle UPDATE_SAMPLE_SUCCEEDED", () => {
        const action = {
            type: UPDATE_SAMPLE.SUCCEEDED,
            payload: {
                id: "123abc",
                name: "test",
            },
        };
        const result = reducer(initialState, action);
        expect(result).toEqual({
            ...initialState,
            detail: action.payload,
        });
    });

    it("should handle UPDATE_SAMPLE_RIGHTS_SUCCEEDED", () => {
        const state = {};
        const action = {
            type: UPDATE_SAMPLE_RIGHTS.SUCCEEDED,
            payload: {
                all_read: true,
                all_write: true,
                group: 1,
                group_read: true,
                group_write: false,
            },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            detail: action.payload,
        });
    });

    it("should handle REMOVE_SAMPLE_SUCCEEDED", () => {
        const action = {
            type: REMOVE_SAMPLE.SUCCEEDED,
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            detail: null,
        });
    });

    it("should handle SELECT_SAMPLE", () => {
        const action = { type: SELECT_SAMPLE, payload: { sampleId: "foo" } };
        const state = { selected: ["bar", "baz"] };
        const result = reducer(state, action);
        expect(result).toEqual({
            selected: ["bar", "baz", "foo"],
        });
    });

    it("should handle SELECT_SAMPLE when sample already selected", () => {
        const action = { type: SELECT_SAMPLE, payload: { sampleId: "foo" } };
        const state = { selected: ["bar", "foo", "baz"] };
        const result = reducer(state, action);
        expect(result).toEqual({
            selected: ["bar", "baz"],
        });
    });

    it("should handle DESELECT_SAMPLES", () => {
        const action = { type: DESELECT_SAMPLES, payload: { sampleIds: ["foo", "bad"] } };
        const state = { selected: ["foo", "bar", "bad", "baz"] };
        const result = reducer(state, action);
        expect(result).toEqual({
            selected: ["bar", "baz"],
        });
    });
});
