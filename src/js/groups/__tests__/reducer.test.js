import { describe, expect, it } from "vitest";
import {
    LIST_GROUPS,
    SET_GROUP_PERMISSION,
    WS_INSERT_GROUP,
    WS_REMOVE_GROUP,
    WS_UPDATE_GROUP,
} from "../../app/actionTypes";
import reducer, { initialState as reducerInitialState, insertGroup, updateGroup } from "../reducer";

describe("Groups Reducer", () => {
    it("should return the initial state on first pass", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual(reducerInitialState);
    });

    it("should return the given state on other action types", () => {
        const action = {
            type: "UNHANDLED_ACTION",
        };
        const result = reducer(reducerInitialState, action);
        expect(result).toEqual(reducerInitialState);
    });

    describe("should handle WS_INSERT_GROUP", () => {
        it("if documents are not yet fetched, return state", () => {
            const state = { documents: null };
            const action = { type: WS_INSERT_GROUP, payload: { id: "foo" } };
            const result = reducer(state, action);
            expect(result).toEqual({
                documents: [{ id: "foo" }],
            });
        });

        it("otherwise insert entry into list", () => {
            const state = { documents: [] };
            const action = {
                type: WS_INSERT_GROUP,
                payload: { id: "test" },
            };
            const result = reducer(state, action);
            expect(result).toEqual({ documents: [{ id: "test" }] });
        });
    });

    it("should handle WS_UPDATE_GROUP", () => {
        const state = { documents: [{ id: "test", foo: "bar" }] };
        const action = {
            type: WS_UPDATE_GROUP,
            payload: { id: "test", foo: "baz" },
        };
        const result = reducer(state, action);
        expect(result).toEqual({ ...state, documents: [{ id: "test", foo: "baz" }] });
    });

    it("should handle WS_REMOVE_GROUP", () => {
        const state = { documents: [{ id: "foo" }, { id: "bar" }] };
        const action = { type: WS_REMOVE_GROUP, payload: ["bar"] };
        const result = reducer(state, action);
        expect(result).toEqual({ ...state, documents: [{ id: "foo" }] });
    });

    it("should handle LIST_GROUPS_SUCCEEDED", () => {
        const state = { documents: null };
        const payload = [{ id: "foo" }, { id: "bar" }];
        const action = {
            type: LIST_GROUPS.SUCCEEDED,
            payload,
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            documents: payload,
        });
    });

    it("should handle SET_GROUP_PERMISSION_SUCCEEDED", () => {
        const payload = { id: "testGroupId" };
        const action = { type: SET_GROUP_PERMISSION.SUCCEEDED, payload };
        const result = reducer({}, action);
        expect(result).toEqual({ activeGroup: { ...payload } });
    });

    describe("Groups Reducer Helper Functions", () => {
        it("updateGroup: should return group list with one permission value of a group updated", () => {
            const state = {
                documents: [
                    {
                        id: "tester",
                        permissions: {
                            test_permission: false,
                        },
                    },
                    {
                        id: "tester_two",
                        permissions: {
                            test_permission: false,
                        },
                    },
                ],
            };
            const update = {
                id: "tester",
                permissions: {
                    test_permission: true,
                },
            };
            const result = updateGroup(state, update);
            expect(result).toEqual({
                ...state,
                documents: [
                    {
                        id: "tester",
                        permissions: {
                            test_permission: true,
                        },
                    },
                    {
                        id: "tester_two",
                        permissions: {
                            test_permission: false,
                        },
                    },
                ],
            });
        });

        it("insertGroup: adds new entry to current list and sorts by id", () => {
            const list = [{ name: "a" }, { name: "d" }, { name: "g" }];
            const entry = { name: "c" };
            const result = insertGroup(list, entry);
            expect(result).toEqual([{ name: "a" }, { name: "c" }, { name: "d" }, { name: "g" }]);
        });
    });
});
