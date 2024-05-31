import { GET_ACCOUNT, LOGOUT } from "@app/actionTypes";
import { describe, expect, it } from "vitest";
import { getAccount, logout } from "../actions";

describe("Account Action Creators:", () => {
    it("getAccount: returns simple action", () => {
        const result = getAccount();
        const expected = {
            type: GET_ACCOUNT.REQUESTED,
        };

        expect(result).toEqual(expected);
    });

    it("logout: returns simple action", () => {
        const result = logout();
        const expected = {
            type: LOGOUT.REQUESTED,
        };

        expect(result).toEqual(expected);
    });
});
