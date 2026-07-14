import { getPasswordPolicyFn } from "../settings/functions";
import {
	createFirstUserFn,
	loginFn,
	logoutFn,
	resetPasswordFn,
} from "./functions";

/**
 * Server functions exempt from global authentication.
 *
 * logoutFn must be exempt so stale or missing cookies can still be cleared.
 * createFirstUserFn runs before any user or session exists.
 * getPasswordPolicyFn serves the first-user and forced-reset forms, which set a
 * password before there is a session to authenticate.
 */
// Annotated rather than inferred: an inferred type would reference TanStack's
// server-fn types transitively, breaking declaration emit for `@server/*`
// importers.
export const authenticationExceptions: ReadonlyArray<{ url: string }> = [
	createFirstUserFn,
	getPasswordPolicyFn,
	loginFn,
	logoutFn,
	resetPasswordFn,
];
