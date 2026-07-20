import type { ErrorEvent, EventHint } from "@sentry/tanstackstart-react";
import {
	FORBIDDEN_ERROR_NAME,
	UNAUTHORIZED_ERROR_NAME,
} from "@virtool/contracts";

const EXPECTED_AUTH_ERROR_NAMES = new Set<string>([
	UNAUTHORIZED_ERROR_NAME,
	FORBIDDEN_ERROR_NAME,
]);

/**
 * Sentry `beforeSend` hook that drops the auth middleware's expected 401/403
 * rejections before they are reported.
 *
 * A server function called without a valid session throws `UnauthorizedError`
 * (or `ForbiddenError` for an insufficient role) by design — the client's query
 * retry guard reads the error name and bounces to the login wall. These are
 * routine control flow, not incidents, so reporting them only buries real
 * errors in noise.
 */
export function dropExpectedAuthErrors(
	event: ErrorEvent,
	hint: EventHint,
): ErrorEvent | null {
	if (
		isExpectedAuthError(hint.originalException) ||
		eventReportsAuthError(event)
	) {
		return null;
	}
	return event;
}

function isExpectedAuthError(exception: unknown): boolean {
	return (
		exception instanceof Error && EXPECTED_AUTH_ERROR_NAMES.has(exception.name)
	);
}

function eventReportsAuthError(event: ErrorEvent): boolean {
	return (
		event.exception?.values?.some(
			(value) =>
				value.type !== undefined && EXPECTED_AUTH_ERROR_NAMES.has(value.type),
		) ?? false
	);
}
