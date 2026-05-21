import { getRequest, setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";

import { db } from "../db/pg";
import { createServerFn, createUnauthenticatedServerFn } from "../fn";
import { realCookies } from "./cookies";
import {
	InvalidCredentialsError,
	InvalidResetSessionError,
	login,
	logout,
	PasswordReuseError,
	resetPassword,
} from "./core";

const loginSchema = z.object({
	handle: z.string().min(1),
	password: z.string().min(1),
	remember: z.boolean().default(false),
});

const resetPasswordSchema = z.object({
	password: z.string().min(1),
	reset_code: z.string().min(1),
});

/** Pull the client IP from the request headers, with a non-null fallback. */
function getClientIp(): string {
	const request = getRequest();
	return (
		request.headers.get("cf-connecting-ip") ??
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
		""
	);
}

/** Login server function. Unauthenticated by necessity — this *creates* the session. */
export const loginFn = createUnauthenticatedServerFn({ method: "POST" })
	.inputValidator(loginSchema)
	.handler(async ({ data }) => {
		try {
			const result = await login(db, realCookies, {
				handle: data.handle,
				password: data.password,
				remember: data.remember,
				ip: getClientIp(),
			});

			if (result.status === "reset_required") {
				setResponseStatus(200);
				return { reset: true as const, reset_code: result.resetCode };
			}

			setResponseStatus(201);
			return { reset: false as const };
		} catch (err) {
			if (err instanceof InvalidCredentialsError) {
				setResponseStatus(400);
				throw new Error("Invalid handle or password.");
			}
			throw err;
		}
	});

/** Logout server function. Requires an authenticated session. */
export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
	await logout(db, realCookies);
	return null;
});

/**
 * Reset-password server function. Unauthenticated by necessity — this is the
 * forced-reset flow that runs before the user has a session. Authorization is
 * carried by the `reset_code` returned from `loginFn`.
 */
export const resetPasswordFn = createUnauthenticatedServerFn({ method: "POST" })
	.inputValidator(resetPasswordSchema)
	.handler(async ({ data }) => {
		try {
			await resetPassword(db, realCookies, {
				password: data.password,
				resetCode: data.reset_code,
				ip: getClientIp(),
			});
			setResponseStatus(200);
			return { login: false as const, reset: false as const };
		} catch (err) {
			if (err instanceof InvalidResetSessionError) {
				setResponseStatus(400);
				throw new Error("Invalid session");
			}
			if (err instanceof PasswordReuseError) {
				setResponseStatus(400);
				throw new Error("Cannot reuse current password");
			}
			throw err;
		}
	});
