import { GET_ACCOUNT } from "@app/actionTypes";
import { describe, expect, it } from "vitest";
import { getAccount } from "../actions";

describe("Account Action Creators:", () => {
    it("getAccount: returns simple action", () => {
        const result = getAccount();
        const expected = {
            type: GET_ACCOUNT.REQUESTED,
        };

        expect(result).toEqual(expected);
    });
});
