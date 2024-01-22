import { describe, expect, it } from "vitest";
import { GET_SETTINGS } from "../../app/actionTypes";
import { getSettings } from "../actions";

describe("getSettings()", () => {
    it("should return an action", () => {
        const result = getSettings();
        expect(result).toEqual({ type: GET_SETTINGS.REQUESTED });
    });
});
