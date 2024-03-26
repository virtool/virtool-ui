import { describe, expect, it, vi } from "vitest";
import {
    BLAST_NUVS,
    LIST_READY_INDEXES,
    SET_ANALYSIS_SORT_KEY,
    TOGGLE_ANALYSIS_SORT_DESCENDING,
    TOGGLE_FILTER_ISOLATES,
    TOGGLE_FILTER_ORFS,
    TOGGLE_FILTER_OTUS,
    TOGGLE_FILTER_SEQUENCES,
    TOGGLE_SHOW_PATHOSCOPE_READS,
    WS_UPDATE_ANALYSIS,
} from "../../app/actionTypes";
import reducer, { setNuvsBLAST } from "../reducer";
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

    it.each([true, false])("should handle TOGGLE_FILTER_OTUS when initially %p", initial => {
        const state = {
            filterIsolates: false,
            filterOTUs: initial,
            filterORFs: false,
            filterSequences: false,
        };
        const action = { type: TOGGLE_FILTER_OTUS };
        const result = reducer(state, action);
        expect(result).toEqual({
            filterIsolates: false,
            filterOTUs: !initial,
            filterORFs: false,
            filterSequences: false,
        });
    });

    it.each([true, false])("should handle TOGGLE_FILTER_ISOLATES when initially %p", initial => {
        const state = { filterIsolates: initial };
        const action = { type: TOGGLE_FILTER_ISOLATES };
        const result = reducer(state, action);
        expect(result).toEqual({ filterIsolates: !initial });
    });

    it.each([true, false])("should handle TOGGLE_FILTER_ORFS when initially %p", initial => {
        const state = { filterORFs: initial };
        const action = { type: TOGGLE_FILTER_ORFS };
        const result = reducer(state, action);
        expect(result).toEqual({ filterORFs: !initial });
    });

    it.each([true, false])("should handle TOGGLE_FILTER_SEQUENCES when initially %p", initial => {
        const state = { filterSequences: initial };
        const action = { type: TOGGLE_FILTER_SEQUENCES };
        const result = reducer(state, action);
        expect(result).toEqual({ filterSequences: !initial });
    });

    it.each([true, false])("should handle TOGGLE_SHOW_PATHOSCOPE_READS", initial => {
        const state = { showPathoscopeReads: initial };
        const action = { type: TOGGLE_SHOW_PATHOSCOPE_READS };
        const result = reducer(state, action);
        expect(result).toEqual({ showPathoscopeReads: !initial });
    });

    it("should handle TOGGLE_ANALYSIS_SORT_DESCENDING", () => {
        const state = { sortDescending: false };
        const action = { type: TOGGLE_ANALYSIS_SORT_DESCENDING };
        const result = reducer(state, action);
        expect(result).toEqual({ sortDescending: true });
    });

    it("should handle SET_ANALYSIS_SORT_KEY", () => {
        const state = { sortKey: "e-value" };
        const action = { type: SET_ANALYSIS_SORT_KEY, payload: { sortKey: "coverage" } };
        const result = reducer(state, action);
        expect(result).toEqual({ sortKey: "coverage" });
    });

    it("should handle LIST_READY_INDEXES_SUCCEEDED", () => {
        const state = { foo: "bar" };
        const action = { type: LIST_READY_INDEXES.SUCCEEDED, payload: ["foo"] };
        const result = reducer(state, action);
        expect(result).toEqual({ foo: "bar", readyIndexes: ["foo"] });
    });

    it("should handle BLAST_NUVS_REQUESTED", () => {
        const state = {
            detail: {
                id: "testid",
                workflow: "nuvs",
                results: { hits: [{ index: 3 }, { index: 5 }] },
            },
        };

        const action = {
            type: BLAST_NUVS.REQUESTED,
            payload: { analysisId: "testid", sequenceIndex: 3 },
        };

        const result = reducer(state, action);

        expect(result).toEqual({
            ...state,
            detail: {
                ...state.detail,
                results: {
                    hits: [{ index: 3, blast: { ready: false } }, { index: 5 }],
                },
            },
        });
    });

    it("should handle BLAST_NUVS_SUCCEEDED", () => {
        const state = {
            detail: {
                id: "testid",
                workflow: "nuvs",
                results: { hits: [{ index: 3 }, { index: 5 }] },
            },
        };

        const action = {
            type: BLAST_NUVS.SUCCEEDED,
            payload: {},
            context: {
                analysisId: "testid",
                sequenceIndex: 3,
            },
        };

        const result = reducer(state, action);

        expect(result).toEqual({
            detail: {
                ...state.detail,
                results: { hits: [{ index: 3, blast: {} }, { index: 5 }] },
            },
        });
    });

    describe("setNuvsBLAST()", () => {
        it("should update with BLAST data when id matches target id", () => {
            const state = {
                detail: {
                    id: "foo",
                    workflow: "nuvs",
                    results: {
                        hits: [{ index: 3 }, { index: 5 }],
                    },
                },
            };

            const analysisId = "foo";
            const sequenceIndex = 3;
            const data = { payload: "data_to_be_added" };
            const result = setNuvsBLAST(state, analysisId, sequenceIndex, data);

            expect(result).toEqual({
                detail: {
                    ...state.detail,
                    results: {
                        hits: [{ index: 3, blast: { payload: "data_to_be_added" } }, { index: 5 }],
                    },
                },
            });
        });

        it("should return state otherwise", () => {
            const state = {
                detail: {
                    id: "foo",
                    workflow: "nuvs",
                    results: [{ index: 3 }, { index: 5 }],
                },
            };
            const analysisId = "bar";
            const sequenceIndex = 3;
            const result = setNuvsBLAST(state, analysisId, sequenceIndex);
            expect(result).toEqual(state);
        });
    });
});
