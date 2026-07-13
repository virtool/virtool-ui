import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequest, setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";

import { db } from "../db/pg";
import { realCookies } from "./cookies";
import {
	createFirstUser,
	FirstUserExistsError,
	InvalidCredentialsError,
	InvalidResetSessionError,
	login,
	logout,
	PasswordReuseError,
	resetPassword,
} from "./core";
import { passwordSchema } from "./password";

// `password` is deliberately not length-checked here. Login authenticates an
// existing credential rather than setting a new one, and rejecting a short
// stored password would lock the user out of the reset flow that fixes it.
const loginSchema = z.object({
	handle: z.string().min(1),
	password: z.string().min(1),
	remember: z.boolean().default(false),
});

const resetPasswordSchema = z.object({
	password: passwordSchema,
	reset_code: z.string().min(1),
});

const createFirstUserSchema = z.object({
	handle: z.string().trim().min(1),
	password: passwordSchema,
});

// Wrapped in createServerOnlyFn so the compiler strips this body and its
// getRequest import from the client bundle. A plain top-level helper would
// keep @tanstack/react-start/server in the client module graph.
const getClientIp = createServerOnlyFn((): string => {
	const request = getRequest();
	return (
		request.headers.get("cf-connecting-ip") ??
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
		""
	);
});

/** Login server function. Unauthenticated by necessity — this *creates* the session. */
export const loginFn = createServerFn({ method: "POST" })
	.validator(loginSchema)
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

/**
 * First-user setup server function. Unauthenticated by necessity — it runs
 * before any user (and therefore any session) exists, and it establishes the
 * session for the user it creates.
 */
export const createFirstUserFn = createServerFn({ method: "POST" })
	.validator(createFirstUserSchema)
	.handler(async ({ data }) => {
		try {
			const user = await createFirstUser(db, realCookies, {
				handle: data.handle,
				password: data.password,
				ip: getClientIp(),
			});
			setResponseStatus(201);
			return user;
		} catch (err) {
			if (err instanceof FirstUserExistsError) {
				setResponseStatus(409);
				throw new Error("Virtool already has a user.");
			}
			throw err;
		}
	});

/** Logout server function. Requires an authenticated session. */
export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
	await logout(db, realCookies);
	Sentry.setUser(null);
	return null;
});

/**
 * Reset-password server function. Unauthenticated by necessity — this is the
 * forced-reset flow that runs before the user has a session. Authorization is
 * carried by the `reset_code` returned from `loginFn`.
 */
export const resetPasswordFn = createServerFn({ method: "POST" })
	.validator(resetPasswordSchema)
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
