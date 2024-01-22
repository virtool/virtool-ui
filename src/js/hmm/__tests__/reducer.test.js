import { describe, expect, it } from "vitest";
import { FIND_HMMS, WS_UPDATE_STATUS } from "../../app/actionTypes";
import reducer, { initialState as reducerInitialState } from "../reducer";

describe("HMM Reducer", () => {
    it("should return the initial state on first pass", () => {
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

    describe("should handle WS_UPDATE_STATUS", () => {
        it("if status update id === 'hmm'", () => {
            const state = {};
            const action = {
                type: WS_UPDATE_STATUS,
                payload: {
                    id: "hmm",
                    installed: {},
                    task: {},
                    release: {},
                },
            };
            const result = reducer(state, action);
            expect(result).toEqual({
                status: {
                    installed: {},
                    task: {},
                    release: {},
                },
            });
        });

        it("otherwise return state", () => {
            const state = {};
            const action = {
                type: WS_UPDATE_STATUS,
                payload: { id: "not_hmm" },
            };
            const result = reducer(state, action);
            expect(result).toEqual(state);
        });
    });

    it("should handle FIND_HMMS_REQUESTED", () => {
        const term = "foo";
        const action = { type: FIND_HMMS.REQUESTED, payload: { term, page: 5 } };
        const result = reducer({}, action);
        expect(result).toEqual({
            term,
        });
    });

    it("should handle FIND_HMMS_SUCCEEDED", () => {
        const state = { documents: null, page: 0 };
        const action = {
            type: FIND_HMMS.SUCCEEDED,
            payload: { documents: [{ id: "foo" }], page: 1 },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            documents: [{ id: "foo" }],
            page: 1,
        });
    });
});
