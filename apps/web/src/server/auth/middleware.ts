import type { AdministratorRoleName } from "@administration/types";
import { hasSufficientAdminRole } from "@administration/utils";
import * as Sentry from "@sentry/tanstackstart-react";
import { createMiddleware, createServerOnlyFn } from "@tanstack/react-start";
import { getRequest, setResponseStatus } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

import { db } from "../db/pg";
import { users } from "../db/schema/users";
import { type AuthenticatedSession, verifyRequest } from "./verify";

/** Thrown by the auth middleware when a request has no valid session. */
export class UnauthorizedError extends Error {
	constructor() {
		super("Unauthorized");
		this.name = "UnauthorizedError";
	}
}

/** Thrown when the session user lacks the required administrator role. */
export class ForbiddenError extends Error {
	constructor() {
		super("Forbidden");
		this.name = "ForbiddenError";
	}
}

/**
 * Read the session user's `administrator_role` from the upstream users table.
 * Returns `null` for a user with no role, or one that no longer exists.
 *
 * Use this where a missing role changes behaviour rather than ending the
 * request — scoping a query to the acting user, say. Use
 * {@link requireAdminRole} where a missing role is a hard 403.
 */
export const getSessionAdminRole = createServerOnlyFn(
	async (
		session: AuthenticatedSession,
	): Promise<AdministratorRoleName | null> => {
		const [row] = await db
			.select({ administratorRole: users.administratorRole })
			.from(users)
			.where(eq(users.id, session.userId))
			.limit(1);

		return row?.administratorRole ?? null;
	},
);

/**
 * Throw `ForbiddenError` (and 403) if the session user lacks the required
 * administrator role. Reads the user's `administrator_role` from the upstream
 * users table; users with a null role are always rejected.
 */
export const requireAdminRole = createServerOnlyFn(
	async (
		session: AuthenticatedSession,
		requiredRole: AdministratorRoleName,
	): Promise<void> => {
		const role = await getSessionAdminRole(session);

		if (!hasSufficientAdminRole(requiredRole, role)) {
			setResponseStatus(403);
			throw new ForbiddenError();
		}
	},
);

/**
 * Resolve the session for the active server-function request or reject with
 * 401. Sets the HTTP response status as a side effect so the serialized error
 * reaches the client as a real 401.
 */
// createServerOnlyFn keeps the getRequest / db / verifyRequest references
// behind a server boundary so import-protection doesn't pin
// @tanstack/react-start/server in the client graph via start.ts.
export const requireSession = createServerOnlyFn(
	async (): Promise<AuthenticatedSession> => {
		const session = await verifyRequest(db, getRequest());
		if (!session) {
			setResponseStatus(401);
			throw new UnauthorizedError();
		}
		return session;
	},
);

/**
 * Resolve the session for a raw `Request` (used by `createFileRoute` handlers
 * outside the server-function async-local context). Returns a 401 `Response`
 * on failure so the caller can `return` it directly.
 */
export const requireAuthenticatedRequest = createServerOnlyFn(
	async (request: Request): Promise<AuthenticatedSession | Response> => {
		const session = await verifyRequest(db, request);
		if (!session) {
			return new Response("Unauthorized", { status: 401 });
		}
		return session;
	},
);

/**
 * Build the global server-function middleware that enforces authentication on
 * every server function except those in `exceptions`. Pass server-function
 * references (e.g. `loginFn`); the URL path is derived from each. Resolved
 * sessions are exposed to downstream handlers as `context.session`.
 */
// Server fn IDs are unique per fn and each fn binds to exactly one method, so
// matching on pathname alone is sufficient to identify the call.
export function createAuthenticationMiddleware(
	exceptions: ReadonlyArray<{ url: string }>,
) {
	const exceptionPaths = new Set(
		exceptions.map((fn) => new URL(fn.url, "http://x").pathname),
	);
	return createMiddleware({ type: "function" }).server(async ({ next }) => {
		const pathname = new URL(getRequest().url).pathname;
		const session: AuthenticatedSession | null = exceptionPaths.has(pathname)
			? null
			: await requireSession();
		// Attach the user to the request's isolation scope so errors and logs
		// from this handler are tied to the acting user. Id-only here — the
		// handle isn't on the session and isn't worth a per-request lookup.
		if (session) {
			Sentry.setUser({ id: session.userId });
		}
		return next({ context: { session } });
	});
}
