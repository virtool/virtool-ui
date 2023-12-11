import { describe, expect, it } from "vitest";
import { AdministratorRoles } from "../../administration/types";
import { FIND_USERS, WS_INSERT_USER, WS_REMOVE_USER, WS_UPDATE_USER } from "../../app/actionTypes";
import reducer, { initialState } from "../reducer";

const defaultUser = {
    id: "bill",
    handle: "test_handle",
    administrator_role: null,
    groups: ["test"],
    primary_group: null,
    force_reset: false,
    last_password_change: "date",
    permissions: {
        cancel_job: Boolean,
        create_ref: Boolean,
        create_sample: Boolean,
        modify_hmm: Boolean,
        modify_subtraction: Boolean,
        remove_file: Boolean,
        remove_job: Boolean,
        upload_file: Boolean,
    },
};

describe("Users Reducer", () => {
    it("should return the initial state on first pass", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual(initialState);
    });

    it("should return the given state on other action types", () => {
        const action = {
            type: "UNHANDLED_ACTION",
        };
        const result = reducer(initialState, action);
        expect(result).toEqual(initialState);
    });

    it("should handle WS_INSERT_USER", () => {
        const state = {
            documents: [],
        };
        const action = {
            type: WS_INSERT_USER,
            payload: defaultUser,
        };
        const result = reducer(state, action);
        const expectedResult = { documents: [action.payload] };
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
    it("should handle WS_UPDATE_USER", () => {
        const state = {
            documents: [
                { ...defaultUser, id: "user_1" },
                { ...defaultUser, id: "user_2" },
            ],
        };
        const action = {
            type: WS_UPDATE_USER,
            payload: { ...defaultUser, id: "user_1", administrator_role: AdministratorRoles.FULL },
        };
        const result = reducer(state, action);
        const expectedResult = {
            documents: [
                { ...defaultUser, id: "user_1", administrator_role: AdministratorRoles.FULL },
                { ...defaultUser, id: "user_2" },
            ],
        };
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });

    it("should handle WS_REMOVE_USER", () => {
        const state = {
            documents: [{ id: "bob" }, { id: "fred" }],
        };
        const action = {
            type: WS_REMOVE_USER,
            payload: ["bob"],
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            documents: [{ id: "fred" }],
        });
    });

    it("should handle FIND_USERS_REQUESTED", () => {
        const term = "foo";
        const action = {
            type: FIND_USERS.REQUESTED,
            payload: { term, page: 3 },
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            term,
        });
    });

    it("should handle FIND_USERS_SUCCEEDED", () => {
        const action = {
            type: FIND_USERS.SUCCEEDED,
            payload: {
                documents: [defaultUser],
            },
        };
        const result = reducer({}, action);
        const expectedResult = { documents: [action.payload.documents[0]] };
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
});
