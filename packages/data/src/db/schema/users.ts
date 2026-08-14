// Read-only mirror of the `users` table managed by the upstream Python service
// via Alembic. Do not generate or push migrations from this side. Keep the
// columns we touch (`id`, `handle`, `password`, `active`, `force_reset`,
// `last_password_change`) in sync with
// `../../../../../../virtool/virtool/users/pg.py`.

import type { AdministratorRoleName } from "@virtool/contracts";
import { type SQL, sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	boolean,
	check,
	customType,
	integer,
	jsonb,
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

export const users = pgTable(
	"users",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		active: boolean("active")
			.$defaultFn(() => true)
			.notNull(),
		// `AdministratorRoleName` carries `spaces` and the constraint does not.
		// Python still serves the role, so the union is the wider of the two and
		// writing `spaces` fails against a real database.
		administratorRole:
			text("administrator_role").$type<AdministratorRoleName>(),
		email: text("email")
			.$defaultFn(() => "")
			.notNull(),
		forceReset: boolean("force_reset")
			.$defaultFn(() => false)
			.notNull(),
		handle: text("handle").notNull(),
		lastPasswordChange: timestamp("last_password_change").notNull(),
		legacyId: text("legacy_id").unique(),
		password: bytea("password").notNull(),
		settings: jsonb("settings").$type<Record<string, unknown>>().notNull(),
	},
	(table) => [
		uniqueIndex("users_handle_lower_unique").on(lower(table.handle)),
		check(
			"administrator_role_valid",
			sql`${table.administratorRole} in ('full', 'settings', 'users', 'base')`,
		),
	],
);

/** A row from the `users` table. */
export type UserRow = typeof users.$inferSelect;
