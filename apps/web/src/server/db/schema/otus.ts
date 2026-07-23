// Partial read-only mirror of the `legacy_otus` table managed by the upstream
// Python service via Alembic. Only the columns needed to count a reference's
// OTUs and to build a clone manifest (`{otu_id: version}`) are declared here —
// the OTU domain is not otherwise served from this side yet. Keep in sync with
// `../../../../../../virtool/virtool/otus/sql.py`.

import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core";

export const legacyOtus = pgTable("legacy_otus", {
	// The upstream primary key is the 8-character Mongo id, a plain string with
	// no identity sequence.
	id: text("id").primaryKey(),
	reference_id: bigint("reference_id", { mode: "number" }).notNull(),
	version: integer("version").notNull(),
});

/** A row from the `legacy_otus` table. */
export type OtuRow = typeof legacyOtus.$inferSelect;
