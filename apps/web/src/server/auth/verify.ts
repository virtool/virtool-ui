import { timingSafeEqual } from "node:crypto";

import { eq } from "drizzle-orm";

import type { Db } from "../db/pg";
import { sessions } from "../db/schema/sessions";
import { users } from "../db/schema/users";
import { SESSION_ID_COOKIE, SESSION_TOKEN_COOKIE } from "./cookies";
import { hashToken } from "./tokens";

/** Authenticated identity resolved from a session cookie pair. */
export type AuthenticatedSession = {
	userId: number;
};

/**
 * Resolve an authenticated session from cookie values. Returns `null` for any
 * non-fatal failure (missing cookies, unknown session, wrong type, expired,
 * deactivated user, or token mismatch) so callers can respond with a single 401
 * without leaking which check failed.
 */
export async function verifyAuthenticatedSession(
	db: Db,
	sessionId: string | undefined,
	sessionToken: string | undefined,
): Promise<AuthenticatedSession | null> {
	if (!sessionId || !sessionToken) {
		return null;
	}

	// A TS-side deactivation deletes the user's sessions, but Python's does not,
	// so `active` still has to be checked on every request rather than trusted at
	// login — a session Python left behind must stop verifying the moment the user
	// goes inactive. The inner join only drops anonymous sessions, which carry no
	// user_id and are rejected anyway.
	const [row] = await db
		.select({
			userId: sessions.userId,
			sessionType: sessions.sessionType,
			tokenHash: sessions.tokenHash,
			expiresAt: sessions.expiresAt,
			active: users.active,
		})
		.from(sessions)
		.innerJoin(users, eq(users.id, sessions.userId))
		.where(eq(sessions.sessionId, sessionId))
		.limit(1);

	if (
		row?.sessionType !== "authenticated" ||
		!row.tokenHash ||
		row.userId === null ||
		!row.active
	) {
		return null;
	}

	if (row.expiresAt.getTime() <= Date.now()) {
		return null;
	}

	const expected = Buffer.from(row.tokenHash, "utf8");
	const provided = Buffer.from(hashToken(sessionToken), "utf8");
	if (
		expected.length !== provided.length ||
		!timingSafeEqual(expected, provided)
	) {
		return null;
	}

	return { userId: row.userId };
}

/**
 * Parse a `Cookie` header into a flat map. Lightweight; sufficient for reading
 * our two session cookies from a raw `Request` (where the `getCookie` helper
 * tied to async-local request context isn't available).
 */
export function parseCookieHeader(
	header: string | null,
): Record<string, string> {
	if (!header) {
		return {};
	}
	const out: Record<string, string> = {};
	for (const part of header.split(";")) {
		const idx = part.indexOf("=");
		if (idx < 0) {
			continue;
		}
		const key = part.slice(0, idx).trim();
		if (!key) {
			continue;
		}
		const value = part.slice(idx + 1).trim();
		out[key] = decodeURIComponent(value);
	}
	return out;
}

/** Resolve an authenticated session directly from a `Request`. */
export async function verifyRequest(
	db: Db,
	request: Request,
): Promise<AuthenticatedSession | null> {
	const cookies = parseCookieHeader(request.headers.get("cookie"));
	return verifyAuthenticatedSession(
		db,
		cookies[SESSION_ID_COOKIE],
		cookies[SESSION_TOKEN_COOKIE],
	);
}
