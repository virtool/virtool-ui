import { describe, expect, it } from "vitest";
import { GET_SETTINGS } from "../../app/actionTypes";
import reducer from "../reducer";

describe("Settings Reducer", () => {
    it("should return the initial state when [state=undefined]", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual({ data: null });
    });

    it("should not update state for unhandled action types", () => {
        const action = {
            type: "UNHANDLED_ACTION",
        };
        const state = { foo: "bar" };
        const result = reducer(state, action);
        expect(result).toEqual(state);
    });

    it("should handle GET_SETTINGS_SUCCEEDED", () => {
        const action = {
            type: GET_SETTINGS.SUCCEEDED,
            payload: { foo: "bar" },
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            data: {
                foo: "bar",
            },
        });
    });
});
