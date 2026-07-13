// Read-only mirror of the `uploads` table managed by the upstream Python
// service via Alembic. Do not generate or push migrations from this side. Keep
// the columns we touch in sync with
// `../../../../../../virtool/virtool/uploads/sql.py`.
//
// `name_on_disk` and the `space` FK are deliberately omitted: the first is
// needed only by the byte-serving paths, which Python still owns, and the
// second is a relic.

import {
	bigint,
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const uploads = pgTable("uploads", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
	createdAt: timestamp("created_at"),
	name: text("name"),
	// Python declares these with a SQLAlchemy-side `default=False`, so the real
	// columns carry no `server_default`. `.default()` would write null into a
	// NOT NULL column.
	ready: boolean("ready")
		.$defaultFn(() => false)
		.notNull(),
	removed: boolean("removed")
		.$defaultFn(() => false)
		.notNull(),
	removedAt: timestamp("removed_at"),
	reserved: boolean("reserved")
		.$defaultFn(() => false)
		.notNull(),
	size: bigint("size", { mode: "number" }),
	// Text with a CHECK constraint, not an enum. `hmm` was dropped from the
	// allowed set by the alembic revision that replaced the enum.
	type: text("type").$type<UploadType>(),
	uploadedAt: timestamp("uploaded_at"),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
});

/** The upload types the `ck_uploads_type` check constraint allows. */
export type UploadType = "reads" | "reference" | "subtraction";

/** A row from the `uploads` table. */
export type UploadRow = typeof uploads.$inferSelect;
