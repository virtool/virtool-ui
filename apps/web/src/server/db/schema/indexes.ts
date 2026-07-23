// Partial read-only mirror of the `indexes` table managed by the upstream
// Python service via Alembic. Only the columns needed to reconstruct a job's
// `args` and to resolve a reference's latest build are declared here — the
// indexes domain is not otherwise served from this side yet. Keep in sync with
// `../../../../../../virtool/virtool/indexes/sql.py`.

import {
	bigint,
	boolean,
	integer,
	pgTable,
	timestamp,
} from "drizzle-orm/pg-core";

export const indexes = pgTable("indexes", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
	version: integer("version"),
	created_at: timestamp("created_at"),
	ready: boolean("ready")
		.$defaultFn(() => false)
		.notNull(),
	reference_id: bigint("reference_id", { mode: "number" }),
	user_id: integer("user_id"),
	job_id: integer("job_id"),
});

/** A row from the `indexes` table. */
export type IndexRow = typeof indexes.$inferSelect;
