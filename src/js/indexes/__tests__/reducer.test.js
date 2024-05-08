import { describe, expect, it } from "vitest";
import {
    GET_INDEX,
    GET_INDEX_HISTORY,
    WS_INSERT_HISTORY,
    WS_INSERT_INDEX,
    WS_UPDATE_INDEX,
} from "../../app/actionTypes";
import reducer, { initialState as reducerInitialState } from "../reducer";

describe("Indexes Reducer", () => {
    it("should return the initial state", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual(reducerInitialState);
    });

    it("should return the given state on other action types", () => {
        const action = {
            type: "UNHANDLED_ACTION",
        };
        const result = reducer(reducerInitialState, action);
        expect(result).toEqual(reducerInitialState);
    });

    describe("should handle WS_INSERT_HISTORY", () => {
        it("increment modified_otu_count if insert into current ref", () => {
            const state = { refId: "foo", modified_otu_count: 3 };
            const action = {
                type: WS_INSERT_HISTORY,
                payload: { reference: { id: "foo" } },
            };
            const result = reducer(state, action);
            expect(result).toEqual({ ...state, modified_otu_count: 4 });
        });

        it("if insert occurs in different reference, return state", () => {
            const state = { refId: "foo" };
            const action = {
                type: WS_INSERT_HISTORY,
                payload: { reference: { id: "bar" } },
            };
            const result = reducer(state, action);
            expect(result).toEqual(state);
        });
    });

    describe("should handle WS_INSERT_INDEX", () => {
        it("return state if list empty or insert in different ref", () => {
            const state = { refId: "foo" };
            const action = {
                type: WS_INSERT_INDEX,
                payload: {
                    reference: { id: "bar" },
                },
            };
            const result = reducer(state, action);
            expect(result).toEqual(state);
        });
    });

    describe("should handle WS_UPDATE_INDEX", () => {
        it("if update is for a different reference index, return state", () => {
            const state = { refId: "foo" };
            const action = {
                type: WS_UPDATE_INDEX,
                payload: { reference: { id: "bar" } },
            };
            const result = reducer(state, action);
            expect(result).toEqual(state);
        });

        it("if update is for current reference, update corresponding entry", () => {
            const state = {
                documents: [{ id: "test", reference: { id: "foo" }, version: 0 }],
                refId: "foo",
            };
            const action = {
                type: WS_UPDATE_INDEX,
                payload: {
                    id: "test",
                    reference: { id: "foo" },
                    version: 1,
                },
            };
            const result = reducer(state, action);
            expect(result).toEqual({
                ...state,
                documents: [{ id: "test", reference: { id: "foo" }, version: 1 }],
            });
        });
    });

    it("should handle GET_INDEX_SUCCEEDED", () => {
        const state = { detail: null };
        const action = {
            type: GET_INDEX.SUCCEEDED,
            payload: { id: "foo", version: 3 },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            detail: action.payload,
        });
    });

    it("should handle GET_INDEX_HISTORY_SUCCEEDED", () => {
        const state = { history: { documents: null } };
        const action = {
            type: GET_INDEX_HISTORY.SUCCEEDED,
            payload: { documents: [{ foo: "bar" }], page: 1, per_page: 3 },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            history: {
                ...action.payload,
            },
        });
    });
});
