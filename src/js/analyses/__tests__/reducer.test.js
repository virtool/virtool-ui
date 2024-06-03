import { describe, expect, it, vi } from "vitest";
import { SET_ANALYSIS_SORT_KEY, WS_UPDATE_ANALYSIS } from "../../app/actionTypes";
import reducer from "../reducer";
import { formatData } from "../utils";

vi.mock("../utils.ts");

formatData.mockImplementation(({ ready, workflow, results }) => ({
    ready,
    workflow,
    results,
    foo: "bar",
}));

describe("Analyses Reducer", () => {
    it("should return the initial state", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual({
            activeId: null,
            detail: null,
            documents: null,
            filterAODP: 0.97,
            filterIsolates: true,
            filterORFs: true,
            filterOTUs: true,
            filterSequences: true,
            readyIndexes: null,
            sampleId: null,
            searchIds: null,
            showPathoscopeReads: false,
            sortDescending: true,
            sortIds: null,
            sortKey: "coverage",
            term: "",
        });
    });

    it("should return the existing state for unhandled action types", () => {
        const state = {
            foo: "bar",
        };
        const action = { type: "UNHANDLED_ACTION" };
        const result = reducer(state, action);
        expect(result).toEqual(state);
    });

    it("should handle WS_UPDATE_ANALYSIS", () => {
        const state = {
            documents: [{ id: "foo", created_at: "2018-01-01T00:00:00.000000Z", sample: { id: "baz" } }],
        };

        const action = {
            type: WS_UPDATE_ANALYSIS,
            payload: {
                id: "foo",
                created_at: "2018-01-01T00:00:00.000000Z",
                sample: {
                    id: "baz",
                },
            },
        };
        const result = reducer(state, action);
        expect(result).toEqual({
            documents: [action.payload],
        });
    });

    it("should handle SET_ANALYSIS_SORT_KEY", () => {
        const state = { sortKey: "e-value" };
        const action = { type: SET_ANALYSIS_SORT_KEY, payload: { sortKey: "coverage" } };
        const result = reducer(state, action);
        expect(result).toEqual({ sortKey: "coverage" });
    });
});
