import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";

import { db } from "../db/pg";
import { realCookies } from "./cookies";
import { InvalidCredentialsError, login, logout } from "./core";

const loginSchema = z.object({
	handle: z.string().min(1),
	password: z.string().min(1),
	remember: z.boolean().default(false),
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

/** Login server function. Mirrors Python's response shape. */
export const loginFn = createServerFn({ method: "POST" })
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

/** Logout server function. Always succeeds, even with no active session. */
export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
	await logout(db, realCookies);
	return null;
});
