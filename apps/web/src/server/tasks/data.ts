import { eq } from "drizzle-orm";
import type { Db } from "../db/pg";
import { tasks as tasksTable } from "../db/schema/tasks";
import { AppError } from "../errors";

/** A background task's live progress and metadata. */
export type Task = {
	complete: boolean;
	created_at: Date;
	error: string | null;
	id: number;
	progress: number;
	step: string;
	type: string;
};

/** Thrown when a requested task does not exist. */
export class TaskNotFoundError extends AppError {}

export async function getTask(db: Db, taskId: number): Promise<Task> {
	const [row] = await db
		.select({
			complete: tasksTable.complete,
			created_at: tasksTable.created_at,
			error: tasksTable.error,
			id: tasksTable.id,
			progress: tasksTable.progress,
			step: tasksTable.step,
			type: tasksTable.type,
		})
		.from(tasksTable)
		.where(eq(tasksTable.id, taskId));

	if (!row) {
		throw new TaskNotFoundError();
	}

	return {
		complete: row.complete ?? false,
		created_at: row.created_at,
		error: row.error,
		id: row.id,
		progress: row.progress ?? 0,
		step: row.step ?? "",
		type: row.type,
	};
}
