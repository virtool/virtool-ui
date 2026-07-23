/**
 * A background task's live progress and metadata, as it is embedded in the
 * resources a task acts on. `created_at` keeps its snake_case name because
 * Python owns the task rows and writes this shape onto the wire.
 */
export type Task = {
	complete: boolean;
	created_at: Date;
	error: string | null;
	id: number;
	progress: number;
	step: string;
	type: string;
};
