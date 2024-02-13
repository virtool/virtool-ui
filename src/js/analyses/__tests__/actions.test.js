import { expect, it } from "vitest";
import {
    BLAST_NUVS,
    GET_ANALYSIS,
    SET_ANALYSIS_SORT_KEY,
    TOGGLE_ANALYSIS_SORT_DESCENDING,
    TOGGLE_FILTER_ORFS,
    TOGGLE_FILTER_SEQUENCES,
    TOGGLE_SHOW_PATHOSCOPE_READS,
    WS_UPDATE_ANALYSIS,
} from "../../app/actionTypes";
import {
    blastNuvs,
    getAnalysis,
    setAnalysisSortKey,
    toggleAnalysisSortDescending,
    toggleFilterORFs,
    toggleFilterSequences,
    toggleShowPathoscopeReads,
    wsUpdateAnalysis,
} from "../actions";

it("wsUpdateAnalysis() should return action to update analysis via websocket", () => {
    const data = { id: "baz", foo: "bar" };
    const result = wsUpdateAnalysis(data);
    expect(result).toEqual({
        type: WS_UPDATE_ANALYSIS,
        payload: data,
    });
});

it("setAnalysisSortKey() should return action to set sort key", () => {
    const sortKey = "foo";
    expect(setAnalysisSortKey(sortKey)).toEqual({
        type: SET_ANALYSIS_SORT_KEY,
        payload: { sortKey },
    });
});

it("toggleFilterORFs() should return action to filter ORFs", () => {
    expect(toggleFilterORFs()).toEqual({ type: TOGGLE_FILTER_ORFS });
});

it("toggleFilterSequences() should return action to filter ORFs", () => {
    expect(toggleFilterSequences()).toEqual({ type: TOGGLE_FILTER_SEQUENCES });
});

it("toggleAnalysisSortDescending() should return action to sort listings", () => {
    expect(toggleAnalysisSortDescending()).toEqual({ type: TOGGLE_ANALYSIS_SORT_DESCENDING });
});

it("toggleShowPathoscopeReads() should return action to display reads", () => {
    expect(toggleShowPathoscopeReads()).toEqual({ type: TOGGLE_SHOW_PATHOSCOPE_READS });
});

it("get() should return action to get a specific analysis", () => {
    const analysisId = "foo";
    const result = getAnalysis(analysisId);
    expect(result).toEqual({
        type: GET_ANALYSIS.REQUESTED,
        payload: { analysisId },
    });
});

it("blastNuvs() should return action to start BLAST analysis", () => {
    const analysisId = "foo";
    const sequenceIndex = 2;
    const result = blastNuvs(analysisId, sequenceIndex);
    expect(result).toEqual({
        type: BLAST_NUVS.REQUESTED,
        payload: { analysisId, sequenceIndex },
    });
});
