import { beforeEach, describe, expect, it } from "vitest";
import { getTaskById } from "../selectors";

describe("getTaskById()", () => {
    let state;
    beforeEach(() => {
        state = {
            tasks: {
                documents: [{ id: "foo" }],
            },
            hmms: { status: { task: { id: "foo" } } },
        };
    });
    it("should return task when it exists", () => {
        const task = getTaskById(state, "foo");
        expect(task).toEqual({ id: "foo" });
    });
    it("should return task when [taskId=undifined]", () => {
        state.hmms.status = undefined;
        const task = getTaskById(state, null);
        expect(task).toBe(undefined);
    });
    it("should return task when [tasks.length=0]", () => {
        state.tasks.documents = [];
        const task = getTaskById(state, "foo");
        expect(task).toBe(undefined);
    });
    it("should return task when [taskId=undefined] and [tasks.length=0]", () => {
        state.hmms.status = undefined;
        state.tasks.documents = [];
        const task = getTaskById(state, null);
        expect(task).toBe(undefined);
    });
});
