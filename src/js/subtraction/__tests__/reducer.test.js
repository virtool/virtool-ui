import { describe, expect, it } from "vitest";
import { WS_REMOVE_SUBTRACTION } from "../../app/actionTypes";
import reducer, { initialState } from "../reducer";

describe("Subtraction Reducer", () => {
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

    it("should handle WS_REMOVE_SUBTRACTION", () => {
        const state = {
            documents: [
                {
                    id: "foo",
                },
            ],
        };
        const action = {
            type: WS_REMOVE_SUBTRACTION,
            payload: ["foo"],
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            documents: [],
        });
    });
});
