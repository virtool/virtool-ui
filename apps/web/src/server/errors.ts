import { CLIENT_ERROR_NAME } from "@virtool/contracts";

/** Base class for domain errors raised by the server data layer. */
export class AppError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = new.target.name;
	}
}

/**
 * An expected, client-facing failure a server-function handler surfaces as a
 * 4xx: a bad login, a missing record, a name conflict. Thrown alongside
 * `setResponseStatus`, it carries the message the client renders. It is routine
 * control flow, not an incident, so `dropExpectedClientErrors` keeps it out of
 * Sentry — throw this rather than a plain `Error` for any deliberate 4xx, or it
 * is reported as an incident.
 */
export class ClientError extends Error {
	/**
	 * The HTTP status the handler set alongside this error, for the client, where
	 * server-function errors arrive as plain `Error`s with no access to the HTTP
	 * response. Carried across the boundary by
	 * `serverErrorSerializationAdapter` (`app/serverErrors.ts`) — Router's
	 * default `ShallowErrorPlugin` would keep only the message.
	 */
	declare readonly status?: number;

	constructor(message: string, status?: number) {
		super(message);
		this.name = CLIENT_ERROR_NAME;
		if (status !== undefined) {
			this.status = status;
		}
	}
}
