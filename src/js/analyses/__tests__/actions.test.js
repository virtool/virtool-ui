import { expect, it } from "vitest";
import {
    BLAST_NUVS,
    SET_ANALYSIS_SORT_KEY,
    TOGGLE_ANALYSIS_SORT_DESCENDING,
    TOGGLE_FILTER_ORFS,
    TOGGLE_FILTER_SEQUENCES,
    WS_UPDATE_ANALYSIS,
} from "../../app/actionTypes";
import {
    blastNuvs,
    setAnalysisSortKey,
    toggleAnalysisSortDescending,
    toggleFilterORFs,
    toggleFilterSequences,
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

it("blastNuvs() should return action to start BLAST analysis", () => {
    const analysisId = "foo";
    const sequenceIndex = 2;
    const result = blastNuvs(analysisId, sequenceIndex);
    expect(result).toEqual({
        type: BLAST_NUVS.REQUESTED,
        payload: { analysisId, sequenceIndex },
    });
});
