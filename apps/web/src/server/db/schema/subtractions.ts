// Partial read-only mirror of the `subtractions` table managed by the upstream
// Python service via Alembic. Only the columns needed to reconstruct a job's
// `args` are declared here — the subtractions domain is not otherwise served
// from this side yet. Keep in sync with
// `../../../../../../virtool/virtool/subtractions/pg.py`.

import { bigint, integer, pgTable } from "drizzle-orm/pg-core";

export const subtractions = pgTable("subtractions", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
	job_id: integer("job_id").unique(),
});
