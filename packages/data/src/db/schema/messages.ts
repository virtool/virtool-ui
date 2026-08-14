// Mirror of the `instance_messages` table. Schema and migrations are owned by
// the upstream Python service via Alembic — do not generate or push migrations
// from this side.

import { sql } from "drizzle-orm";
import {
	boolean,
	check,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/** One of the allowed instance-message colors stored in `instance_messages.color`. */
export type MessageColor =
	| "red"
	| "yellow"
	| "blue"
	| "purple"
	| "orange"
	| "grey";

export const instanceMessages = pgTable(
	"instance_messages",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		active: boolean("active").$defaultFn(() => true),
		color: text("color").$type<MessageColor>().notNull(),
		message: text("message"),
		createdAt: timestamp("created_at"),
		updatedAt: timestamp("updated_at"),
		user: text("user"),
		// Nullable upstream: a row migrated from Mongo carries its author in the
		// legacy `user` column, and a trigger resolves `user_id` from it. Every
		// read joins on it, so a row that predates the backfill is simply invisible.
		userId: integer("user_id").references(() => users.id),
	},
	(table) => [
		uniqueIndex("instance_messages_one_active")
			.on(table.active)
			.where(sql`${table.active} = true`),
		check(
			"ck_instance_messages_color",
			sql`${table.color} in ('red', 'yellow', 'blue', 'purple', 'orange', 'grey')`,
		),
	],
);

/** A row from the `instance_messages` table. */
export type InstanceMessageRow = typeof instanceMessages.$inferSelect;
