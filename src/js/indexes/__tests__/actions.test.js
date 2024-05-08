import { describe, expect, it } from "vitest";
import {
    GET_INDEX,
    GET_INDEX_HISTORY,
    LIST_READY_INDEXES,
    WS_INSERT_HISTORY,
    WS_UPDATE_INDEX,
} from "../../app/actionTypes";
import { getIndex, getIndexHistory, listReadyIndexes, wsInsertHistory, wsUpdateIndex } from "../actions";

describe("Index Action Creators", () => {
    it("wsInsertHistory() should return action to insert history via websocket", () => {
        const data = { foo: "bar" };
        const result = wsInsertHistory(data);
        expect(result).toEqual({
            type: WS_INSERT_HISTORY,
            payload: { ...data },
        });
    });

    it("wsUpdateIndex() should return action to update an index via websocket", () => {
        const data = { foo: "baz" };
        const result = wsUpdateIndex(data);
        expect(result).toEqual({
            type: WS_UPDATE_INDEX,
            payload: { ...data },
        });
    });

    it("listReadyIndexes() should return action to get a list of all ready indexes", () => {
        const result = listReadyIndexes();
        expect(result).toEqual({ type: LIST_READY_INDEXES.REQUESTED });
    });

    it("getIndex() should return action to get a specific index version", () => {
        const indexId = "foo";
        const result = getIndex(indexId);
        expect(result).toEqual({
            type: GET_INDEX.REQUESTED,
            payload: { indexId },
        });
    });

    it("getIndexHistory() should return action to retrieve a page of history for an indexId", () => {
        const indexId = "foo";
        const page = 1;
        const result = getIndexHistory(indexId, page);
        expect(result).toEqual({
            type: GET_INDEX_HISTORY.REQUESTED,
            payload: { indexId, page },
        });
    });
});
