// Partial read-only mirror of the `legacy_samples` table managed by the
// upstream Python service via Alembic. Only the columns needed to reconstruct a
// job's `args` are declared here — the samples domain is not otherwise served
// from this side yet. Keep in sync with
// `../../../../../../virtool/virtool/samples/sql.py`.

import { bigint, integer, pgTable } from "drizzle-orm/pg-core";

export const legacySamples = pgTable("legacy_samples", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
	job_id: integer("job_id").unique(),
});
