/** Base class for domain errors raised by the server data layer. */
export class AppError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = new.target.name;
	}
}

/**
 * The `.name` every `ClientError` carries. A string literal rather than the
 * class name so it survives server minification — the same reason the auth
 * error names are literals — because the Sentry filter matches on it.
 */
export const CLIENT_ERROR_NAME = "ClientError";

/**
 * An expected, client-facing failure a server-function handler surfaces as a
 * 4xx: a bad login, a missing record, a name conflict. Thrown alongside
 * `setResponseStatus`, it carries the message the client renders. It is routine
 * control flow, not an incident, so `dropExpectedClientErrors` keeps it out of
 * Sentry — throw this rather than a plain `Error` for any deliberate 4xx, or it
 * is reported as an incident.
 */
export class ClientError extends Error {
	constructor(message: string) {
		super(message);
		this.name = CLIENT_ERROR_NAME;
	}
}
