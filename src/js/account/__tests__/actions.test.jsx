import { describe, expect, it } from "vitest";
import {
    CHANGE_ACCOUNT_PASSWORD,
    CLEAR_API_KEY,
    CREATE_API_KEY,
    GET_ACCOUNT,
    GET_API_KEYS,
    LOGOUT,
    REMOVE_API_KEY,
    UPDATE_ACCOUNT,
    UPDATE_ACCOUNT_SETTINGS,
    UPDATE_API_KEY,
} from "@app/actionTypes";
import {
    changePassword,
    clearAPIKey,
    createAPIKey,
    getAccount,
    getAPIKeys,
    logout,
    removeAPIKey,
    updateAccount,
    updateAccountSettings,
    updateAPIKey,
} from "../actions";

describe("Account Action Creators:", () => {
    it("getAccount: returns simple action", () => {
        const result = getAccount();
        const expected = {
            type: GET_ACCOUNT.REQUESTED,
        };

        expect(result).toEqual(expected);
    });

    it("updateAccount: returns action with account update", () => {
        const update = { email: "example@test.com" };
        const result = updateAccount(update);
        const expected = {
            type: UPDATE_ACCOUNT.REQUESTED,
            payload: { update },
        };

        expect(result).toEqual(expected);
    });

    it("updateAccountSettings: returns action with settings update", () => {
        const update = {
            quick_analyze_workflow: "pathoscope_bowtie",
        };
        const result = updateAccountSettings(update);
        const expected = {
            type: UPDATE_ACCOUNT_SETTINGS.REQUESTED,
            payload: { update },
        };

        expect(result).toEqual(expected);
    });

    it("changePassword: returns action for password change", () => {
        const oldPassword = "oldpassword";
        const newPassword = "newpassword";
        const result = changePassword(oldPassword, newPassword);
        const expected = {
            type: CHANGE_ACCOUNT_PASSWORD.REQUESTED,
            payload: { old_password: oldPassword, password: newPassword },
        };

        expect(result).toEqual(expected);
    });

    it("getAPIKeys: returns simple action", () => {
        const result = getAPIKeys();
        const expected = {
            type: GET_API_KEYS.REQUESTED,
        };

        expect(result).toEqual(expected);
    });

    it("createAPIKey: returns action for new API key", () => {
        const name = "testapi";
        const permissions = {};
        const result = createAPIKey(name, permissions);
        const expected = {
            type: CREATE_API_KEY.REQUESTED,
            payload: { name, permissions },
        };

        expect(result).toEqual(expected);
    });

    it("clearAPIKey: returns simple action", () => {
        const result = clearAPIKey();
        const expected = {
            type: CLEAR_API_KEY,
        };

        expect(result).toEqual(expected);
    });

    it("updateAPIKey: returns action for API key update", () => {
        const keyId = "uniqueid";
        const permissions = {};
        const result = updateAPIKey(keyId, permissions);
        const expected = {
            type: UPDATE_API_KEY.REQUESTED,
            payload: { keyId, permissions },
        };

        expect(result).toEqual(expected);
    });

    it("removeAPIKey: returns action for API key remove", () => {
        const keyId = "uniqueid";
        const result = removeAPIKey(keyId);
        const expected = {
            type: REMOVE_API_KEY.REQUESTED,
            payload: { keyId },
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
