import { describe, expect, it } from "vitest";
import { FIND_HMMS } from "../../app/actionTypes";
import { findHmms } from "../actions";

describe("HMM Action Creators:", () => {
    it("findHmms: returns action for filtering results by search term", () => {
        const term = "search";
        const page = 5;
        const result = findHmms(term, page);
        expect(result).toEqual({
            type: FIND_HMMS.REQUESTED,
            payload: { term, page },
        });
    });
});
