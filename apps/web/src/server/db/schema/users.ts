// Read-only mirror of the `users` table managed by the upstream Python service
// via Alembic. Do not generate or push migrations from this side. Keep the
// columns we touch (`id`, `handle`, `password`, `active`, `force_reset`,
// `last_password_change`, `invalidate_sessions`) in sync with
// `../../../../../../virtool/virtool/users/pg.py`.

import { type SQL, sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	boolean,
	customType,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; default: false }>({
	dataType() {
		return "bytea";
	},
});

function lower(column: AnyPgColumn): SQL {
	return sql`lower(${column})`;
}

export const administratorRole = pgEnum("administratorrole", [
	"full",
	"settings",
	"spaces",
	"users",
	"base",
]);

export const users = pgTable(
	"users",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		active: boolean("active")
			.$defaultFn(() => true)
			.notNull(),
		administratorRole: administratorRole("administrator_role"),
		email: text("email")
			.$defaultFn(() => "")
			.notNull(),
		forceReset: boolean("force_reset")
			.$defaultFn(() => false)
			.notNull(),
		handle: text("handle").notNull(),
		// NOT NULL with no server_default on the Python side, so the `$defaultFn`
		// is load-bearing: `createUser` never sets this column and would violate
		// the constraint without it. Nothing on either side reads the value —
		// sessions are revoked directly (`invalidateUserSessions`) rather than via
		// this flag — so dropping the column is Python's Alembic change to make.
		invalidateSessions: boolean("invalidate_sessions")
			.$defaultFn(() => false)
			.notNull(),
		lastPasswordChange: timestamp("last_password_change").notNull(),
		legacyId: text("legacy_id").unique(),
		password: bytea("password").notNull(),
		settings: jsonb("settings").$type<Record<string, unknown>>().notNull(),
	},
	(table) => [uniqueIndex("users_handle_lower_unique").on(lower(table.handle))],
);

/** A row from the `users` table. */
export type UserRow = typeof users.$inferSelect;
