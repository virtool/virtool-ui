// Read-only mirror of the `tasks` table managed by the upstream Python service
// via Alembic. Do not generate or push migrations from this side. Keep the
// columns in sync with `../../../../../../virtool/virtool/tasks/sql.py`.

import { sql } from "drizzle-orm";
import {
	bigint,
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const tasks = pgTable(
	"tasks",
	{
		// The upstream column is an autoincrementing integer primary key. Declared as
		// an identity so the test database (whose DDL is generated from this schema)
		// fills `id` on insert the way the real sequence-backed column does; Drizzle
		// never pushes this DDL to the real database, which Python owns.
		id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
		acquired_at: timestamp("acquired_at"),
		complete: boolean("complete").$defaultFn(() => false),
		context: jsonb("context"),
		count: integer("count").$defaultFn(() => 0),
		created_at: timestamp("created_at").notNull(),
		error: text("error"),
		file_size: bigint("file_size", { mode: "number" }),
		progress: integer("progress").$defaultFn(() => 0),
		runner_id: varchar("runner_id", { length: 255 }),
		step: text("step"),
		type: text("type").notNull(),
	},
	(table) => [
		index("idx_tasks_active")
			.on(table.acquired_at)
			.where(sql`${table.complete} = false and ${table.error} is null`),
		index("idx_tasks_unacquired")
			.on(table.acquired_at)
			.where(sql`${table.acquired_at} is null`),
	],
);

/** A row from the `tasks` table. */
export type TaskRow = typeof tasks.$inferSelect;
