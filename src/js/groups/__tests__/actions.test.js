import { LIST_GROUPS, WS_INSERT_GROUP, WS_REMOVE_GROUP, WS_UPDATE_GROUP } from "../../app/actionTypes";
import { listGroups, wsInsertGroup, wsRemoveGroup, wsUpdateGroup } from "../actions";

describe("Groups Action Creators:", () => {
    it("wsInsertGroup: returns action for websocket data insert", () => {
        const data = { id: "test" };
        const result = wsInsertGroup(data);
        expect(result).toEqual({
            type: WS_INSERT_GROUP,
            payload: { ...data },
        });
    });

    it("wsUpdateGroup: returns action for websocket data update", () => {
        const data = { id: "test", foo: "bar" };
        const result = wsUpdateGroup(data);
        expect(result).toEqual({
            type: WS_UPDATE_GROUP,
            payload: { ...data },
        });
    });

    it("wsRemoveGroup: returns action for websocket data remove", () => {
        const data = ["test"];
        const result = wsRemoveGroup(data);
        expect(result).toEqual({
            type: WS_REMOVE_GROUP,
            payload: data,
        });
    });

    it("listGroups: returns simple action", () => {
        const result = listGroups();
        expect(result).toEqual({
            type: LIST_GROUPS.REQUESTED,
        });
    });
});
