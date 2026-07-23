// Partial read-only mirror of the `legacy_history` table managed by the
// upstream Python service via Alembic. Only the columns needed to aggregate a
// reference's contributors and unbuilt-change count are declared here — the
// history domain is not otherwise served from this side yet. Keep in sync with
// `../../../../../../virtool/virtool/history/sql.py`.

import { bigint, integer, pgTable } from "drizzle-orm/pg-core";

export const legacyHistory = pgTable("legacy_history", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
	user_id: integer("user_id").notNull(),
	reference_id: bigint("reference_id", { mode: "number" }),
	index_id: bigint("index_id", { mode: "number" }),
});

/** A row from the `legacy_history` table. */
export type HistoryRow = typeof legacyHistory.$inferSelect;
