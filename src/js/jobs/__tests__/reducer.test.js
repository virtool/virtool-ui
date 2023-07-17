import { describe, expect, it } from "vitest";
import { FIND_JOBS, GET_JOB } from "../../app/actionTypes";
import reducer, { initialState as reducerInitialState } from "../reducer";

describe("Job Reducer", () => {
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

    it("should handle FIND_JOBS_SUCCEEDED", () => {
        const state = { documents: null };
        const documents = [{ id: "foo" }];
        const action = {
            type: FIND_JOBS.SUCCEEDED,
            payload: { documents },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            documents,
        });
    });

    it("should handle GET_JOB_REQUESTED", () => {
        const state = { detail: { foo: "bar" } };
        const action = { type: GET_JOB.REQUESTED };
        const result = reducer(state, action);
        expect(result).toEqual({
            detail: null,
        });
    });

    it("should handle GET_JOB_SUCCEEDED", () => {
        const state = {};
        const action = {
            type: GET_JOB.SUCCEEDED,
            payload: { id: "foo" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            detail: action.payload,
        });
    });
});
