import { expect, it } from "vitest";
import { SET_ANALYSIS_SORT_KEY, WS_UPDATE_ANALYSIS } from "../../app/actionTypes";
import { setAnalysisSortKey, wsUpdateAnalysis } from "../actions";

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
