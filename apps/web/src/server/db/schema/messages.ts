// Read-only mirror of the `instance_messages` table managed by the upstream
// Python service via Alembic. Do not generate or push migrations from this
// side. Keep the columns in sync with
// `../../../../../../virtool/virtool/messages/sql.py`.

import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const messageColor = pgEnum("messagecolor", [
	"red",
	"yellow",
	"blue",
	"purple",
	"orange",
	"grey",
]);

export const instanceMessages = pgTable("instance_messages", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	active: boolean("active").default(true),
	color: messageColor("color").notNull(),
	message: text("message"),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
	user: text("user"),
});

/** A row from the `instance_messages` table. */
export type InstanceMessageRow = typeof instanceMessages.$inferSelect;
