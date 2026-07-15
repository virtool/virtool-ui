import { createSerializationAdapter } from "@tanstack/react-router";

/**
 * Name of the error the server auth middleware throws when a request has no
 * valid session.
 */
export const UNAUTHORIZED_ERROR_NAME = "UnauthorizedError";

/**
 * Name of the error the server auth middleware throws when the session user
 * lacks the required administrator role.
 */
export const FORBIDDEN_ERROR_NAME = "ForbiddenError";

const AUTH_ERROR_NAMES = new Set<string>([
	UNAUTHORIZED_ERROR_NAME,
	FORBIDDEN_ERROR_NAME,
]);

/** An auth error reduced to the fields that survive serialization. */
type SerializedAuthError = {
	name: string;
	message: string;
};

/**
 * Carries an auth error's `name` across the server-function boundary.
 *
 * TanStack Router's built-in `ShallowErrorPlugin` matches every `Error` and
 * serializes only its `message`, so a server function's `UnauthorizedError`
 * reaches the client as a plain `Error` named `"Error"`. That erases the one
 * field the query retry guard and `handleAuthenticationError` use to recognize
 * a 401/403 — without it, an auth failure is retried ~4× with backoff before
 * the guard can bounce to the login wall. Registered adapters run before the
 * default plugins, so this one re-serializes the auth errors with their `name`
 * intact and rebuilds them client-side. Everything else still falls through to
 * `ShallowErrorPlugin` unchanged.
 */
export const authErrorSerializationAdapter = createSerializationAdapter<
	Error,
	SerializedAuthError
>({
	key: "AuthError",
	test: (value): value is Error =>
		value instanceof Error && AUTH_ERROR_NAMES.has(value.name),
	toSerializable: (error) => ({ name: error.name, message: error.message }),
	fromSerializable: ({ name, message }) => {
		const error = new Error(message);
		error.name = name;
		return error;
	},
});
