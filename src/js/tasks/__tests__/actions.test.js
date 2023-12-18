import { describe, expect, it } from "vitest";
import { LIST_TASKS, WS_INSERT_TASK, WS_UPDATE_TASK } from "../../app/actionTypes";
import { listTasks, wsInsertTask, wsUpdateTask } from "../actions";

describe("wsInsertTask()", () => {
    it("should return action to insert new task", () => {
        const data = { id: "123abc" };
        const result = wsInsertTask(data);
        expect(result).toEqual({ type: WS_INSERT_TASK, payload: { ...data } });
    });
});

describe("wsUpdateTask()", () => {
    it("should return action to update existing task", () => {
        const data = { id: "123abc", foo: "bar" };
        const result = wsUpdateTask(data);
        expect(result).toEqual({ type: WS_UPDATE_TASK, payload: { ...data } });
    });
});

describe("listTask()", () => {
    it("should return action to list all tasks", () => {
        expect(listTasks()).toEqual({ type: LIST_TASKS.REQUESTED });
    });
});
