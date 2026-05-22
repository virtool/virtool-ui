import { createServerOnlyFn } from "@tanstack/react-start";
import {
	deleteCookie,
	getCookie,
	setCookie,
} from "@tanstack/react-start/server";

/** Names of the two cookies the Python backend reads on each request. */
export const SESSION_ID_COOKIE = "session_id";
export const SESSION_TOKEN_COOKIE = "session_token";

// Python sets `max_age=2_600_000` on both cookies regardless of the row's
// actual `expires_at`. The browser keeps the cookie alive for ~30 days; the DB
// row's `expires_at` is the real authority. Match Python so cookies set by
// either side look identical.
const MAX_AGE_SECONDS = 2_600_000;

type Bool = boolean;

function cookieOptions(secure: Bool) {
	return {
		httpOnly: true,
		secure,
		sameSite: "lax" as const,
		path: "/",
		maxAge: MAX_AGE_SECONDS,
	};
}

function isSecure(): boolean {
	return process.env.NODE_ENV === "production";
}

/** Read/write/clear access to the pair of session cookies. */
export type CookieAdapter = {
	getSessionId(): string | undefined;
	getSessionToken(): string | undefined;
	setSessionId(sessionId: string): void;
	setSessionToken(token: string): void;
	clear(): void;
};

// Each method is wrapped in createServerOnlyFn so the references to
// getCookie/setCookie/deleteCookie sit behind a server boundary the compiler
// recognizes — otherwise the object literal at module scope would pin
// @tanstack/react-start/server in any client-reachable import chain.
export const realCookies: CookieAdapter = {
	getSessionId: createServerOnlyFn(() => getCookie(SESSION_ID_COOKIE)),
	getSessionToken: createServerOnlyFn(() => getCookie(SESSION_TOKEN_COOKIE)),
	setSessionId: createServerOnlyFn((sessionId: string) => {
		setCookie(SESSION_ID_COOKIE, sessionId, cookieOptions(isSecure()));
	}),
	setSessionToken: createServerOnlyFn((token: string) => {
		setCookie(SESSION_TOKEN_COOKIE, token, cookieOptions(isSecure()));
	}),
	clear: createServerOnlyFn(() => {
		deleteCookie(SESSION_ID_COOKIE, { path: "/" });
		deleteCookie(SESSION_TOKEN_COOKIE, { path: "/" });
	}),
};
