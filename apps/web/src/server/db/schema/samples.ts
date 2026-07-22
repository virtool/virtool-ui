// Partial read-only mirror of the `legacy_samples` table and the
// `legacy_sample_subtractions` join table managed by the upstream Python service
// via Alembic. Only the columns needed from this side are declared. Keep in sync
// with `../../../../../../virtool/virtool/samples/sql.py`.

import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core";

export const legacySamples = pgTable("legacy_samples", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
	name: text("name"),
	job_id: integer("job_id").unique(),
});

// Join table linking a sample to its default subtractions. Read from the
// subtraction side to compute a subtraction's `linked_samples`.
export const legacySampleSubtractions = pgTable("legacy_sample_subtractions", {
	sample_id: bigint("sample_id", { mode: "number" }).notNull(),
	subtraction_id: bigint("subtraction_id", { mode: "number" }).notNull(),
});
