import { describe, expect, it } from "vitest";
import { REMOVE_SUBTRACTION } from "../../app/actionTypes";
import { removeSubtraction } from "../actions";

describe("Subtraction Action Creators:", () => {
    const subtractionId = "foobar";

    it("removeSubtraction", () => {
        const result = removeSubtraction(subtractionId);
        expect(result).toEqual({
            type: REMOVE_SUBTRACTION.REQUESTED,
            payload: { subtractionId },
        });
    });
});
