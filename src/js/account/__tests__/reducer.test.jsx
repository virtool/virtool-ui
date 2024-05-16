import { GET_ACCOUNT } from "@app/actionTypes";
import { describe, expect, it } from "vitest";
import reducer from "../reducer";

describe("Account Reducer", () => {
    it("should return the initial state when [state=undefined]", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual({
            apiKeys: null,
            newKey: null,
            ready: false,
        });
    });

    it("should return the given state on other action types", () => {
        const action = {
            type: "UNHANDLED_ACTION",
        };
        const state = { foo: "bar" };
        const result = reducer(state, action);
        expect(result).toEqual(state);
    });

    it("should handle GET_ACCOUNT_SUCCEEDED", () => {
        const action = {
            type: GET_ACCOUNT.SUCCEEDED,
            payload: {
                foo: "bar",
            },
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            foo: "bar",
            ready: true,
        });
    });
});
