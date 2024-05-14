import { forEach } from "lodash-es";
import { describe, expect, it } from "vitest";
import { EDIT_SEQUENCE, GET_OTU, WS_UPDATE_OTU } from "../../app/actionTypes";
import reducer, { getActiveIsolate, hideOTUModal, initialState as reducerInitialState, receiveOTU } from "../reducer";

describe("OTUs Reducer:", () => {
    it("should return the initial state on first pass", () => {
        const result = reducer(undefined, {});
        expect(result).toEqual(reducerInitialState);
    });

    it("should return the given state on other action types", () => {
        const action = { type: "UNHANDLED_ACTION" };
        const state = { foo: true };
        const result = reducer(state, action);
        expect(result).toEqual(state);
    });

    describe("should handle WS_UPDATE_OTU", () => {
        it("if reference ids do not match, return state", () => {
            const state = { refId: "foo" };
            const action = {
                type: WS_UPDATE_OTU,
                payload: { id: "test", reference: { id: "bar" } },
            };
            const result = reducer(state, action);
            expect(result).toEqual(state);
        });

        it("otherwise insert new entry into list", () => {
            const refId = "baz";
            const state = {
                refId,
                documents: [{ id: "test-otu", foo: "bar", reference: { id: refId } }],
            };
            const action = {
                type: WS_UPDATE_OTU,
                payload: {
                    id: "test-otu",
                    foo: "baz",
                    reference: { id: refId },
                },
            };
            const result = reducer(state, action);
            expect(result).toEqual({
                refId,
                documents: [{ id: "test-otu", foo: "baz", reference: { id: refId } }],
            });
        });
    });

    it("should handle GET_OTU_REQUESTED", () => {
        const state = {};
        const action = { type: GET_OTU.REQUESTED };
        const result = reducer(state, action);
        expect(result).toEqual({
            ...hideOTUModal(state),
            detail: null,
            activeIsolateId: null,
        });
    });

    describe("Actions that close all modals:", () => {
        const actionList = [GET_OTU.SUCCEEDED, EDIT_SEQUENCE.SUCCEEDED];

        forEach(actionList, actionType => {
            it(`should handle ${actionType}`, () => {
                const action = {
                    type: actionType,
                    payload: { id: "test-otu", isolates: [] },
                };
                const result = reducer({}, action);
                expect(result).toEqual({
                    detail: action.payload,
                    ...hideOTUModal({}),
                    activeIsolate: null,
                    activeIsolateId: null,
                });
            });
        });
    });
});

describe("Helper functions:", () => {
    describe("getActiveIsolate():", () => {
        it("if isolates array is empty, return state with null activeIsolate values", () => {
            const state = { detail: { isolates: [] } };
            const result = getActiveIsolate(state);
            expect(result).toEqual({
                ...state,
                activeIsolate: null,
                activeIsolateId: null,
            });
        });

        it("otherwise get current activeIsolateId that defaults to first isolate", () => {
            const state = { detail: { isolates: [{ id: "isolate" }] } };
            const result = getActiveIsolate(state);
            expect(result).toEqual({
                ...state,
                activeIsolate: { id: "isolate" },
                activeIsolateId: "isolate",
            });
        });
    });

    it("receiveOTU(): replace state.detail with action data and reformat isolates", () => {
        const action = {
            isolates: [{ id: "123abc", sourceType: "isolate", sourceName: "tester" }],
        };
        const result = receiveOTU({}, action);
        expect(result).toEqual({
            activeIsolate: {
                id: "123abc",
                sourceType: "isolate",
                sourceName: "tester",
                name: "Isolate tester",
            },
            activeIsolateId: "123abc",
            detail: {
                isolates: [{ ...action.isolates[0], name: "Isolate tester" }],
            },
        });
    });
});
