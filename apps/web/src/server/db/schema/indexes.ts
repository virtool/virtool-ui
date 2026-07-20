// Partial read-only mirror of the `indexes` table managed by the upstream
// Python service via Alembic. Only the columns needed to reconstruct a job's
// `args` are declared here — the indexes domain is not otherwise served from
// this side yet. Keep in sync with
// `../../../../../../virtool/virtool/indexes/sql.py`.

import { bigint, integer, pgTable } from "drizzle-orm/pg-core";

export const indexes = pgTable("indexes", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
	job_id: integer("job_id"),
});
