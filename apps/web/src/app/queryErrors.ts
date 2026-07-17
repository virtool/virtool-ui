import { endSession } from "@app/session";
import {
	FORBIDDEN_ERROR_NAME,
	UNAUTHORIZED_ERROR_NAME,
} from "@virtool/contracts";

/** A failed query's error, carrying an HTTP status when superagent raised it. */
export type QueryError = Error & { response?: { status?: number } };

const NON_RETRYABLE_STATUSES = new Set([401, 403, 404]);

/**
 * End the session when a query fails because the session is gone.
 *
 * Wired into the query and mutation caches' `onError`.
 */
// Server-function errors reach the client with their `name` preserved only
// because `authErrorSerializationAdapter` (start.ts) carries it past Router's
// ShallowErrorPlugin, so a 401 is matched by name here. Superagent calls are
// covered by the interceptor in `app/api.ts` instead.
//
// A 403 is deliberately not handled: the session is valid, the user just lacks
// the role, so bouncing them to the login wall would be wrong.
export function handleAuthenticationError(error: Error): void {
	if (error.name === UNAUTHORIZED_ERROR_NAME) {
		endSession();
	}
}

/** Decide whether React Query should retry a failed query. */
export function shouldRetryQuery(
	failureCount: number,
	error: QueryError,
): boolean {
	// Superagent (legacy Python API) errors carry the HTTP status here.
	const status = error.response?.status;
	if (status !== undefined && NON_RETRYABLE_STATUSES.has(status)) {
		return false;
	}
	// TanStack Start server-function errors cross the boundary with only
	// `message` preserved by default; the status set via `setResponseStatus` is
	// not attached, and Router's ShallowErrorPlugin drops `name`.
	// `authErrorSerializationAdapter` (registered in start.ts) keeps the auth
	// errors' `name`, so matching by name here makes a 401/403 (e.g. after
	// logout, or an unauthenticated first visit) reject immediately instead of
	// retrying ~4× while the screen sits blank before the route can bounce to
	// /login.
	if (
		error.name === UNAUTHORIZED_ERROR_NAME ||
		error.name === FORBIDDEN_ERROR_NAME
	) {
		return false;
	}
	return failureCount <= 3;
}
