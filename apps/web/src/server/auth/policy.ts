import type { AdministratorRoleName } from "@administration/types";
import {
	AdministratorPermissions,
	hasSufficientAdminRole,
} from "@administration/utils";
import type { Permission } from "@groups/types";
import { createMiddleware, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

import { db } from "../db/pg";
import { groups, userGroups } from "../db/schema/groups";
import { users } from "../db/schema/users";
import { ForbiddenError, requireSession } from "./middleware";
import type { AuthenticatedSession } from "./verify";

// Every server function declares one of the policies below with `.middleware()`.
// It cannot be a wrapper around `createServerFn` — the Vite plugin matches that
// call syntactically at the definition site, and behind a factory it stops
// recognising the function as a server function at all (no RPC endpoint, and the
// handler body ships to the browser). So the policy is a middleware, the
// declaration is a convention, and `authorization.test.ts` is what makes the
// convention non-optional: it calls every server function with no session and
// fails the build on any that does not refuse.

// The global authentication middleware has already resolved the session and put
// it here. Reusing it keeps an authenticated call to a single session lookup.
type UpstreamContext = { session?: AuthenticatedSession | null };

// Absent only in tests, which run a handler without the global middleware.
const resolveSession = createServerOnlyFn(
	async (context: unknown): Promise<AuthenticatedSession> => {
		return (context as UpstreamContext).session ?? (await requireSession());
	},
);

const forbid = createServerOnlyFn((): never => {
	setResponseStatus(403);
	throw new ForbiddenError();
});

/**
 * Whether the user holds `name` — through the union of their groups'
 * permissions, or by holding an administrator role that covers it.
 *
 * Mirrors `checkAdminRoleOrPermissionsFromAccount` on the client: the two must
 * agree, or the UI offers an action the server then refuses.
 */
export const hasPermission = createServerOnlyFn(
	async (session: AuthenticatedSession, name: Permission): Promise<boolean> => {
		const [row] = await db
			.select({ administratorRole: users.administratorRole })
			.from(users)
			.where(eq(users.id, session.userId))
			.limit(1);

		if (!row) {
			return false;
		}

		if (
			hasSufficientAdminRole(
				AdministratorPermissions[name],
				row.administratorRole,
			)
		) {
			return true;
		}

		const memberships = await db
			.select({ permissions: groups.permissions })
			.from(groups)
			.innerJoin(userGroups, eq(userGroups.groupId, groups.id))
			.where(eq(userGroups.userId, session.userId));

		return memberships.some((membership) => membership.permissions[name]);
	},
);

/**
 * Callable without a session. Reserved for the endpoints that *establish* one:
 * login, first-user setup, logout, and the password policy the reset form reads
 * before it has anywhere to authenticate to.
 *
 * A function declared `open()` must also appear in `authenticationExceptions`,
 * and one that isn't declared `open()` must not — `authorization.test.ts` pins
 * both directions.
 */
export function open() {
	return createMiddleware({ type: "function" }).server(
		async ({ context, next }) => {
			const session = (context as unknown as UpstreamContext).session ?? null;
			return next({ context: { session } });
		},
	);
}

/**
 * Callable by any signed-in user. The deliberate choice for reads that carry no
 * secret — the job list, the group list, labels — and not a fallback for "I
 * haven't decided yet".
 */
export function authenticated() {
	return createMiddleware({ type: "function" }).server(
		async ({ context, next }) => {
			const session = await resolveSession(context);
			return next({ context: { session } });
		},
	);
}

/** Callable only by an administrator holding at least `role`. */
export function adminRole(role: AdministratorRoleName) {
	return createMiddleware({ type: "function" }).server(
		async ({ context, next }) => {
			const session = await resolveSession(context);

			const [row] = await db
				.select({ administratorRole: users.administratorRole })
				.from(users)
				.where(eq(users.id, session.userId))
				.limit(1);

			if (!row || !hasSufficientAdminRole(role, row.administratorRole)) {
				forbid();
			}

			return next({ context: { session } });
		},
	);
}

/**
 * Callable by a user granted `name` through group membership, or by an
 * administrator whose role covers it.
 */
export function permission(name: Permission) {
	return createMiddleware({ type: "function" }).server(
		async ({ context, next }) => {
			const session = await resolveSession(context);

			if (!(await hasPermission(session, name))) {
				forbid();
			}

			return next({ context: { session } });
		},
	);
}
