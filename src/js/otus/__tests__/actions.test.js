import { describe, expect, it } from "vitest";
import { EDIT_SEQUENCE, GET_OTU, GET_OTU_HISTORY, REVERT, WS_UPDATE_OTU } from "../../app/actionTypes";
import { editSequence, getOTU, getOTUHistory, revert, wsUpdateOTU } from "../actions";

describe("OTUs Action Creators", () => {
    const otuId = "test-otu";
    const isolateId = "test-isolate";
    const sequenceId = "test-sequence-id";
    const accession = "test-accession";
    const definition = "test-definition";
    const host = "test-host";
    const sequence = "test-sequence";
    const segment = "test-segment";
    const target = "test-target";

    it("wsUpdateOTU: returns action to update OTU entry via websocket", () => {
        const data = { id: "test", foo: "bar" };
        const result = wsUpdateOTU(data);
        expect(result).toEqual({ type: WS_UPDATE_OTU, payload: { ...data } });
    });

    it("getOTU: returns action to retrieve a specific otu", () => {
        const result = getOTU(otuId);
        expect(result).toEqual({ type: GET_OTU.REQUESTED, payload: { otuId } });
    });

    it("getOTUHistory: returns action to retrieve change history of specific otu", () => {
        const result = getOTUHistory(otuId);
        expect(result).toEqual({
            type: GET_OTU_HISTORY.REQUESTED,
            payload: { otuId },
        });
    });

    it("editSequence: returns action to edit a specific sequence", () => {
        const result = editSequence({
            otuId,
            isolateId,
            sequenceId,
            accession,
            definition,
            host,
            sequence,
            segment,
            target,
        });
        expect(result).toEqual({
            type: EDIT_SEQUENCE.REQUESTED,
            payload: {
                otuId,
                isolateId,
                sequenceId,
                accession,
                definition,
                host,
                sequence,
                segment,
                target,
            },
        });
    });

    it("revert: returns action to undo the latest change of a particular otu", () => {
        const changeId = "123abc";
        const otuVersion = 3;
        const result = revert(otuId, otuVersion, changeId);
        expect(result).toEqual({
            type: REVERT.REQUESTED,
            payload: { otuId, otuVersion, change_id: changeId },
        });
    });
});
