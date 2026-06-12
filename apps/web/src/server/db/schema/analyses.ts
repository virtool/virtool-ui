// Partial read-only mirror of the `analyses` table managed by the upstream
// Python service via Alembic. Only the columns needed to reconstruct a job's
// `args` are declared here — the analyses domain is not otherwise served from
// this side yet. Keep in sync with
// `../../../../../../virtool/virtool/analyses/sql.py`.

import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core";

export const analyses = pgTable("analyses", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
	legacy_id: text("legacy_id").unique(),
	job_id: integer("job_id"),
});
