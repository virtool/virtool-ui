import { describe, expect, it } from "vitest";
import {
    ADD_SEQUENCE,
    EDIT_OTU,
    EDIT_SEQUENCE,
    GET_OTU,
    GET_OTU_HISTORY,
    HIDE_OTU_MODAL,
    REMOVE_ISOLATE,
    REMOVE_OTU,
    REMOVE_SEQUENCE,
    REVERT,
    SELECT_ISOLATE,
    SET_ISOLATE_AS_DEFAULT,
    SHOW_EDIT_ISOLATE,
    SHOW_EDIT_OTU,
    SHOW_REMOVE_ISOLATE,
    SHOW_REMOVE_OTU,
    SHOW_REMOVE_SEQUENCE,
    WS_REMOVE_OTU,
    WS_UPDATE_OTU,
} from "../../app/actionTypes";
import {
    addSequence,
    editOTU,
    editSequence,
    getOTU,
    getOTUHistory,
    hideOTUModal,
    removeIsolate,
    removeOTU,
    removeSequence,
    revert,
    selectIsolate,
    setIsolateAsDefault,
    showEditIsolate,
    showEditOTU,
    showRemoveIsolate,
    showRemoveOTU,
    showRemoveSequence,
    wsRemoveOTU,
    wsUpdateOTU,
} from "../actions";

describe("OTUs Action Creators", () => {
    const otuId = "test-otu";
    const isolateId = "test-isolate";
    const sequenceId = "test-sequence-id";
    const accession = "test-accession";
    const sourceType = "test-source-type";
    const sourceName = "test-source-name";
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

    it("wsRemoveOTU: returns action to remove OTU entry via websocket", () => {
        const data = ["test"];
        const result = wsRemoveOTU(data);
        expect(result).toEqual({ type: WS_REMOVE_OTU, payload: data });
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

    it("editOTU: return action to edit a specific otu", () => {
        const name = "target-otu";
        const abbreviation = "OLD";
        const schema = [];
        const result = editOTU(otuId, name, abbreviation, schema);
        expect(result).toEqual({
            type: EDIT_OTU.REQUESTED,
            payload: { otuId, name, abbreviation, schema },
        });
    });

    it("removeOTU: returns action to delete specific otu", () => {
        const refId = "123abc";
        const history = {};
        const result = removeOTU(refId, otuId, history);
        expect(result).toEqual({
            type: REMOVE_OTU.REQUESTED,
            payload: { refId, otuId, history },
        });
    });

    it("setIsolateAsDefault: returns action to set specific isolate as default", () => {
        const result = setIsolateAsDefault(otuId, isolateId);
        expect(result).toEqual({
            type: SET_ISOLATE_AS_DEFAULT.REQUESTED,
            payload: { otuId, isolateId },
        });
    });

    it("removeIsolate: returns action to delete a specific isolate", () => {
        const nextIsolateId = "test-other-isolate";
        const result = removeIsolate(otuId, isolateId, nextIsolateId);
        expect(result).toEqual({
            type: REMOVE_ISOLATE.REQUESTED,
            payload: { otuId, isolateId, nextIsolateId },
        });
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

    it("removeSequence: returns action to remove a specific sequence", () => {
        const result = removeSequence(otuId, isolateId, sequenceId);
        expect(result).toEqual({
            type: REMOVE_SEQUENCE.REQUESTED,
            payload: { otuId, isolateId, sequenceId },
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

    it("selectIsolate: returns action to select isolate to expand", () => {
        const result = selectIsolate(isolateId);
        expect(result).toEqual({
            type: SELECT_ISOLATE,
            payload: { isolateId },
        });
    });

    it("showEditOTU: returns action to display edit otu modal", () => {
        expect(showEditOTU()).toEqual({ type: SHOW_EDIT_OTU });
    });

    it("showRemoveOTU: returns action to display remove otu modal", () => {
        expect(showRemoveOTU()).toEqual({ type: SHOW_REMOVE_OTU });
    });

    it("showEditIsolate: returns action to display edit isolate modal", () => {
        const result = showEditIsolate(otuId, isolateId, sourceType, sourceName);
        expect(result).toEqual({
            type: SHOW_EDIT_ISOLATE,
            payload: { otuId, isolateId, sourceType, sourceName },
        });
    });

    it("showRemoveIsolate: returns action to display remove isolate modal", () => {
        expect(showRemoveIsolate()).toEqual({ type: SHOW_REMOVE_ISOLATE });
    });

    it("showRemoveSequence: returns action to display remove sequence modal", () => {
        const result = showRemoveSequence(sequenceId);
        expect(result).toEqual({
            type: SHOW_REMOVE_SEQUENCE,
            payload: { sequenceId },
        });
    });

    it("hideOTUModal: returns action to hide otu modal", () => {
        expect(hideOTUModal()).toEqual({ type: HIDE_OTU_MODAL });
    });
});
