import { describe, expect, it } from "vitest";
import { GET_TASK, LIST_TASKS, WS_INSERT_TASK, WS_UPDATE_TASK } from "../../app/actionTypes";
import tasksReducer from "../reducer";

describe("tasksReducer()", () => {
    it("should return the initial state on first pass", () => {
        const result = tasksReducer(undefined, {});
        expect(result).toEqual({ detail: null, documents: [] });
    });

    it("should return the given state on other action types", () => {
        const state = { foo: "bar" };
        const action = { type: "UNHANDLED_ACTION" };
        const result = tasksReducer(state, action);
        expect(result).toEqual(state);
    });

    it("should handle WS_INSERT_TASK", () => {
        const state = { documents: [] };
        const action = { type: WS_INSERT_TASK, payload: { id: "test" } };
        const result = tasksReducer(state, action);
        expect(result).toEqual({ documents: [{ id: "test" }] });
    });

    it("should handle WS_UPDATE_TASK", () => {
        const state = { documents: [{ id: "test", foo: "bar" }] };
        const action = { type: WS_UPDATE_TASK, payload: { id: "test", foo: "baz" } };
        const result = tasksReducer(state, action);
        expect(result).toEqual({ documents: [{ id: "test", foo: "baz" }] });
    });

    it("should handle LIST_TASKS_SUCCEEDED", () => {
        const state = { documents: [] };
        const action = {
            type: LIST_TASKS.SUCCEEDED,
            payload: [{ id: "test1" }, { id: "test2" }, { id: "test3" }],
        };
        const result = tasksReducer(state, action);
        expect(result).toEqual({ documents: [...action.payload] });
    });

    it("should handle GET_TASK_REQUESTED", () => {
        const state = { detail: { foo: "bar" } };
        const action = { type: GET_TASK.REQUESTED };
        const result = tasksReducer(state, action);
        expect(result).toEqual({ detail: null });
    });

    it("should handle GET_TASK_SUCCEEDED", () => {
        const state = { detail: null };
        const action = { type: GET_TASK.SUCCEEDED, payload: { foo: "bar" } };
        const result = tasksReducer(state, action);
        expect(result).toEqual({ detail: { foo: "bar" } });
    });
});
