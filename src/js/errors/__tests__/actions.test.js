import { describe, expect, it } from "vitest";
import { CLEAR_ERROR } from "../../app/actionTypes";
import { clearError } from "../actions";

describe("Errors Action Creators:", () => {
    it("should create an action to clear specific error", () => {
        const error = "TARGET_ERROR";
        const result = clearError(error);
        const expected = {
            type: CLEAR_ERROR,
            payload: { error },
        };

        expect(result).toEqual(expected);
    });
});
