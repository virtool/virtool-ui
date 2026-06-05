import { createMiddleware } from "@tanstack/react-start";
import { getRequest, getResponseStatus } from "@tanstack/react-start/server";
import { logger } from "./logger";

/**
 * Global server-function middleware that logs every error a server function
 * raises before it propagates to the client.
 *
 * The client only ever sees a serialized `message`, so the underlying cause of
 * an unexpected failure — most often a Drizzle `DrizzleQueryError` whose real
 * Postgres error lives on `.cause` — is otherwise lost. Logging here, at the one
 * chokepoint every server function passes through, guarantees that cause is
 * recorded regardless of how each feature maps its own domain errors.
 *
 * Intentional client errors set a 4xx status before throwing (see each
 * feature's `rethrowAsHttp`); those are logged at debug. Anything else is
 * unexpected and logged at error with its full `cause` chain.
 */
export const errorLoggingMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	try {
		return await next();
	} catch (err) {
		const status = getResponseStatus();
		const path = new URL(getRequest().url).pathname;

		if (status >= 400 && status < 500) {
			logger.debug({ err, path, status }, "server function rejected request");
		} else {
			logger.error({ err, path, status }, "unhandled server function error");
		}

		throw err;
	}
});
