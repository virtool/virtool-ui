// Read-only mirror of the `sessions` table managed by the upstream Python
// service via Alembic. Do not generate or push migrations from this side. Keep
// columns in sync with `../../../../../../virtool/virtool/sessions/models.py`.

import { sql } from "drizzle-orm";
import {
	boolean,
	check,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users";

/** One of the session kinds stored in `sessions.session_type`. */
export type SessionType = "anonymous" | "authenticated" | "reset";

export const sessions = pgTable(
	"sessions",
	{
		id: serial("id").primaryKey(),
		sessionId: text("session_id").notNull().unique(),
		userId: integer("user_id").references(() => users.id, {
			onDelete: "cascade",
		}),
		ip: text("ip").notNull(),
		createdAt: timestamp("created_at").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		tokenHash: text("token_hash"),
		resetCode: text("reset_code"),
		resetRemember: boolean("reset_remember"),
		sessionType: text("session_type").$type<SessionType>().notNull(),
	},
	(table) => [
		check(
			"session_type_valid",
			sql`${table.sessionType} in ('anonymous', 'authenticated', 'reset')`,
		),
	],
);

/** A row from the `sessions` table. */
export type SessionRow = typeof sessions.$inferSelect;
