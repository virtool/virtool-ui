import type { ErrorEvent, EventHint } from "@sentry/tanstackstart-react";
import {
	FORBIDDEN_ERROR_NAME,
	UNAUTHORIZED_ERROR_NAME,
} from "@virtool/contracts";
import { CLIENT_ERROR_NAME } from "./errors";

const EXPECTED_CLIENT_ERROR_NAMES = new Set<string>([
	UNAUTHORIZED_ERROR_NAME,
	FORBIDDEN_ERROR_NAME,
	CLIENT_ERROR_NAME,
]);

/**
 * Sentry `beforeSend` hook that drops a server function's expected client-facing
 * errors before they are reported.
 *
 * Two kinds slip through here, both routine control flow rather than incidents:
 * the auth middleware's 401/403 rejections (`UnauthorizedError` /
 * `ForbiddenError`), whose name the client's retry guard reads to bounce to the
 * login wall; and the handlers' deliberate 4xx `ClientError`s — a bad login, a
 * missing record, a name conflict — which the client renders as a message.
 * Reporting either only buries real errors in noise.
 */
export function dropExpectedClientErrors(
	event: ErrorEvent,
	hint: EventHint,
): ErrorEvent | null {
	if (
		isExpectedClientError(hint.originalException) ||
		eventReportsClientError(event)
	) {
		return null;
	}
	return event;
}

function isExpectedClientError(exception: unknown): boolean {
	return (
		exception instanceof Error &&
		EXPECTED_CLIENT_ERROR_NAMES.has(exception.name)
	);
}

function eventReportsClientError(event: ErrorEvent): boolean {
	return (
		event.exception?.values?.some(
			(value) =>
				value.type !== undefined && EXPECTED_CLIENT_ERROR_NAMES.has(value.type),
		) ?? false
	);
}
