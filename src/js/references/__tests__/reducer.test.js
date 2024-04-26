import { EDIT_REFERENCE, GET_REFERENCE, WS_INSERT_REFERENCE, WS_UPDATE_REFERENCE } from "@app/actionTypes";
import { describe, expect, it } from "vitest";
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
});
