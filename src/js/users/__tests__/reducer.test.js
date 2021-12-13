import {
    WS_INSERT_USER,
    WS_UPDATE_USER,
    WS_REMOVE_USER,
    FIND_USERS,
    GET_USER,
    CREATE_USER,
    EDIT_USER
} from "../../app/actionTypes";
import reducer, { initialState } from "../reducer";

describe("Users Reducer", () => {
    it("should return the initial state on first pass", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual(initialState);
    });

    it("should return the given state on other action types", () => {
        const action = {
            type: "UNHANDLED_ACTION"
        };
        const result = reducer(initialState, action);
        expect(result).toEqual(initialState);
    });

    it("should handle WS_INSERT_USER", () => {
        const state = {
            documents: []
        };
        const action = {
            type: WS_INSERT_USER,
            payload: {
                id: "bill"
            }
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            documents: [action.payload]
        });
    });
    it("should handle WS_UPDATE_USER", () => {
        const state = {
            documents: [
                { id: "bob", administrator: true },
                { id: "fred", administrator: false }
            ]
        };
        const action = {
            type: WS_UPDATE_USER,
            payload: {
                id: "fred",
                administrator: true
            }
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            documents: [
                { id: "bob", administrator: true },
                { id: "fred", administrator: true }
            ]
        });
    });

    it("should handle WS_REMOVE_USER", () => {
        const state = {
            documents: [{ id: "bob" }, { id: "fred" }]
        };
        const action = {
            type: WS_REMOVE_USER,
            payload: ["bob"]
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            documents: [{ id: "fred" }]
        });
    });

    it("should handle FIND_USERS_REQUESTED", () => {
        const term = "foo";
        const action = {
            type: FIND_USERS.REQUESTED,
            payload: { term, page: 3 }
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            term
        });
    });

    it("should handle FIND_USERS_SUCCEEDED", () => {
        const action = {
            type: FIND_USERS.SUCCEEDED,
            payload: {
                documents: [{ id: "foo" }]
            }
        };
        const result = reducer({}, action);
        expect(result).toEqual(action.payload);
    });

    it("should handle GET_USER_REQUESTED", () => {
        const state = {
            detail: {
                id: "foo"
            }
        };
        const action = {
            type: GET_USER.REQUESTED,
            payload: { userId: "bob" }
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            detail: null
        });
    });

    it("should handle GET_USER_SUCCEEDED", () => {
        const action = {
            type: GET_USER.SUCCEEDED,
            payload: {
                administrator: true,
                force_reset: false,
                groups: [],
                id: "testUser",
                last_password_change: "2018-01-01T00:00:00.000000Z",
                permissions: {},
                primary_group: ""
            }
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            detail: action.payload
        });
    });

    it("should handle CREATE_USER_REQUESTED", () => {
        const action = {
            type: CREATE_USER.REQUESTED
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            createPending: true
        });
    });

    it("should handle CREATE_USER_SUCCEEDED", () => {
        const action = {
            type: CREATE_USER.SUCCEEDED
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            createPending: false
        });
    });

    it("should handle CREATE_USER_FAILED", () => {
        const action = {
            type: CREATE_USER.FAILED,
            message: "user already exists",
            status: 400
        };
        const result = reducer({}, action);
        expect(result).toEqual({
            createPending: false
        });
    });

    describe("should handle EDIT_USER_REQUESTED", () => {
        it("when handling password update, return [passwordPending=true]", () => {
            const action = {
                type: EDIT_USER.REQUESTED,
                payload: {
                    userId: "bob",
                    update: {
                        password: "new_password"
                    }
                }
            };
            const result = reducer({}, action);
            expect(result).toEqual({
                passwordPending: true
            });
        });

        it("otherwise return state", () => {
            const action = {
                type: EDIT_USER.REQUESTED,
                payload: {
                    update: {
                        other: "not_password"
                    }
                }
            };
            const result = reducer(initialState, action);
            expect(result).toEqual(initialState);
        });
    });

    it("should handle EDIT_USER_SUCCEEDED", () => {
        const state = {
            ...initialState,
            detail: {
                id: "testUser",
                permissions: { testing: false }
            }
        };
        const action = {
            type: EDIT_USER.SUCCEEDED,
            payload: {
                id: "user",
                permissions: { testing: true }
            }
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...state,
            detail: action.payload
        });
    });
});
