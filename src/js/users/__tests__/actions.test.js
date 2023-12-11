import { describe, expect, it } from "vitest";
import { FIND_USERS, WS_INSERT_USER, WS_REMOVE_USER, WS_UPDATE_USER } from "../../app/actionTypes";
import { findUsers, wsInsertUser, wsRemoveUser, wsUpdateUser } from "../actions";

describe("Users Action Creators", () => {
    const userId = "bill";

    it("wsInsertUser", () => {
        const payload = {};
        const result = wsInsertUser(payload);
        expect(result).toEqual({
            type: WS_INSERT_USER,
            payload,
        });
    });

    it("wsUpdateUser", () => {
        const payload = {};
        const result = wsUpdateUser(payload);
        expect(result).toEqual({
            type: WS_UPDATE_USER,
            payload,
        });
    });

    it("wsRemoveUser", () => {
        const payload = {};
        const result = wsRemoveUser(payload);
        expect(result).toEqual({
            type: WS_REMOVE_USER,
            payload,
        });
    });

    it("findUsers", () => {
        const term = "foo";
        const page = 5;
        const result = findUsers(term, page);
        expect(result).toEqual({
            type: FIND_USERS.REQUESTED,
            payload: { term, page },
        });
    });
});
