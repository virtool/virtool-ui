import {
    WS_INSERT_USER,
    WS_UPDATE_USER,
    WS_REMOVE_USER,
    GET_USER,
    CREATE_USER,
    EDIT_USER,
    REMOVE_USER,
    FIND_USERS
} from "../../app/actionTypes";
import {
    wsInsertUser,
    wsUpdateUser,
    wsRemoveUser,
    getUser,
    createUser,
    editUser,
    removeUser,
    findUsers
} from "../actions";

describe("Users Action Creators", () => {
    const userId = "bill";

    it("wsInsertUser", () => {
        const payload = {};
        const result = wsInsertUser(payload);
        expect(result).toEqual({
            type: WS_INSERT_USER,
            payload
        });
    });

    it("wsUpdateUser", () => {
        const payload = {};
        const result = wsUpdateUser(payload);
        expect(result).toEqual({
            type: WS_UPDATE_USER,
            payload
        });
    });

    it("wsRemoveUser", () => {
        const payload = {};
        const result = wsRemoveUser(payload);
        expect(result).toEqual({
            type: WS_REMOVE_USER,
            payload
        });
    });

    it("findUsers", () => {
        const term = "foo";
        const page = 5;
        const result = findUsers(term, page);
        expect(result).toEqual({
            type: FIND_USERS.REQUESTED,
            payload: { term, page }
        });
    });

    it("getUser", () => {
        const result = getUser(userId);
        expect(result).toEqual({
            type: GET_USER.REQUESTED,
            payload: { userId }
        });
    });

    it("createUser", () => {
        const payload = {};
        const result = createUser(payload);
        expect(result).toEqual({
            type: CREATE_USER.REQUESTED,
            payload
        });
    });

    it("editUser", () => {
        const update = {};
        const result = editUser(userId, update);
        expect(result).toEqual({
            type: EDIT_USER.REQUESTED,
            payload: { userId, update }
        });
    });

    it("removeUser", () => {
        const result = removeUser(userId);
        expect(result).toEqual({
            type: REMOVE_USER.REQUESTED,
            payload: { userId }
        });
    });
});
