import { randomBytes } from "node:crypto";

import { and, eq } from "drizzle-orm";

import type { Db } from "../db/pg";
import { type SessionRow, sessions } from "../db/schema/sessions";
import { hashToken, newSessionId, newSessionToken } from "./tokens";

// Python lifetimes in `virtool/sessions/data.py`:
//   - authenticated + remember: 30 days
//   - authenticated, no remember: 60 minutes
//   - reset: 10 minutes
// We mirror them so a row written here is indistinguishable from one written
// by the Python backend.
const SESSION_LIFETIME_REMEMBER_MS = 30 * 24 * 60 * 60 * 1000;
const SESSION_LIFETIME_NO_REMEMBER_MS = 60 * 60 * 1000;
const RESET_LIFETIME_MS = 10 * 60 * 1000;

/** Inputs to mint an authenticated session row. */
export type CreateAuthenticatedSessionInput = {
	userId: number;
	ip: string;
	remember: boolean;
};

/** Output: the cookie values the caller must set, plus the inserted row. */
export type CreateAuthenticatedSessionResult = {
	sessionId: string;
	token: string;
	row: SessionRow;
};

export async function createAuthenticatedSession(
	db: Db,
	{ userId, ip, remember }: CreateAuthenticatedSessionInput,
): Promise<CreateAuthenticatedSessionResult> {
	const sessionId = newSessionId();
	const token = newSessionToken();
	const tokenHash = hashToken(token);
	const now = new Date();
	const lifetime = remember
		? SESSION_LIFETIME_REMEMBER_MS
		: SESSION_LIFETIME_NO_REMEMBER_MS;
	const expiresAt = new Date(now.getTime() + lifetime);

	const [row] = await db
		.insert(sessions)
		.values({
			sessionId,
			userId,
			ip,
			createdAt: now,
			expiresAt,
			tokenHash,
			sessionType: "authenticated",
		})
		.returning();

	return { sessionId, token, row };
}

/** Inputs to mint a forced-reset session row. */
export type CreateResetSessionInput = {
	userId: number;
	ip: string;
	remember: boolean;
};

/** Output: the session_id cookie value, the reset_code returned to the client, and the row. */
export type CreateResetSessionResult = {
	sessionId: string;
	resetCode: string;
	row: SessionRow;
};

export async function createResetSession(
	db: Db,
	{ userId, ip, remember }: CreateResetSessionInput,
): Promise<CreateResetSessionResult> {
	const sessionId = newSessionId();
	const resetCode = randomBytes(32).toString("hex");
	const now = new Date();
	const expiresAt = new Date(now.getTime() + RESET_LIFETIME_MS);

	const [row] = await db
		.insert(sessions)
		.values({
			sessionId,
			userId,
			ip,
			createdAt: now,
			expiresAt,
			resetCode,
			resetRemember: remember,
			sessionType: "reset",
		})
		.returning();

	return { sessionId, resetCode, row };
}

export async function invalidateSession(
	db: Db,
	sessionId: string,
): Promise<void> {
	await db.delete(sessions).where(eq(sessions.sessionId, sessionId));
}

export async function invalidateUserAuthenticatedSessions(
	db: Db,
	userId: number,
): Promise<void> {
	await db
		.delete(sessions)
		.where(
			and(
				eq(sessions.userId, userId),
				eq(sessions.sessionType, "authenticated"),
			),
		);
}
