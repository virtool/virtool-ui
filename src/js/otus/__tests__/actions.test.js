import { describe, expect, it } from "vitest";
import { ADD_SEQUENCE, EDIT_SEQUENCE, GET_OTU, WS_UPDATE_OTU } from "../../app/actionTypes";
import { addSequence, editSequence, getOTU, wsUpdateOTU } from "../actions";

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

    it("addSequence: returns action to add a new sequence to an isolate", () => {
        const result = addSequence({
            otuId,
            isolateId,
            accession,
            definition,
            host,
            sequence,
            segment,
            target,
        });
        expect(result).toEqual({
            type: ADD_SEQUENCE.REQUESTED,
            payload: {
                otuId,
                isolateId,
                accession,
                definition,
                host,
                sequence,
                segment,
                target,
            },
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
});
