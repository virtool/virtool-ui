import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { getTask as getTaskImpl, TaskNotFoundError } from "./data";

const taskIdSchema = z.object({
	taskId: z.number().int().positive(),
});

// Wrapped in createServerOnlyFn so the compiler can strip this body — and the
// TaskNotFoundError import it references — from the client bundle. A plain
// top-level helper would pin ./data and its postgres transitive dependency in
// the client graph.
const rethrowAsHttp = createServerOnlyFn((err: unknown): never => {
	if (err instanceof TaskNotFoundError) {
		setResponseStatus(404);
		throw new Error("Task not found.");
	}
	throw err;
});

export const getTask = createServerFn({ method: "GET" })
	.inputValidator(taskIdSchema)
	.handler(async ({ data }) => {
		try {
			return await getTaskImpl(data.taskId);
		} catch (err) {
			rethrowAsHttp(err);
		}
	});
