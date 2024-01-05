import { describe, expect, it } from "vitest";
import { REMOVE_SUBTRACTION, WS_REMOVE_SUBTRACTION } from "../../app/actionTypes";
import { removeSubtraction, wsRemoveSubtraction } from "../actions";

describe("Subtraction Action Creators:", () => {
    const subtractionId = "foobar";

    it("wsRemoveSubtraction", () => {
        const data = ["testSubtraction"];
        const result = wsRemoveSubtraction(data);
        expect(result).toEqual({
            type: WS_REMOVE_SUBTRACTION,
            payload: data,
        });
    });

    it("removeSubtraction", () => {
        const result = removeSubtraction(subtractionId);
        expect(result).toEqual({
            type: REMOVE_SUBTRACTION.REQUESTED,
            payload: { subtractionId },
        });
    });
});
