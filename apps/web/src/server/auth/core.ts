import { sql } from "drizzle-orm";

import type { Db } from "../db/pg";
import { users } from "../db/schema/users";
import type { CookieAdapter } from "./cookies";
import { verifyPassword } from "./password";
import {
	createAuthenticatedSession,
	createResetSession,
	invalidateSession,
} from "./session";

// A real bcrypt hash used to equalize timing when no user is found. Keeps the
// missing-handle and wrong-password code paths indistinguishable to a timing
// observer.
const TIMING_DUMMY_HASH = Buffer.from(
	"$2b$12$0000000000000000000000000000000000000000000000000000O",
	"utf8",
);

/** Plaintext credentials submitted by a login attempt. */
export type LoginInput = {
	handle: string;
	password: string;
	remember: boolean;
	ip: string;
};

/** Outcome of a successful credential check; reset_required defers to /reset. */
export type LoginResult =
	| { status: "authenticated" }
	| { status: "reset_required"; resetCode: string };

export class InvalidCredentialsError extends Error {
	constructor() {
		super("Invalid credentials");
		this.name = "InvalidCredentialsError";
	}
}

export async function login(
	db: Db,
	cookies: CookieAdapter,
	input: LoginInput,
): Promise<LoginResult> {
	const handle = input.handle.toLowerCase();

	const [user] = await db
		.select()
		.from(users)
		.where(sql`lower(${users.handle}) = ${handle}`)
		.limit(1);

	if (!user?.active) {
		await verifyPassword(input.password, TIMING_DUMMY_HASH);
		throw new InvalidCredentialsError();
	}

	const ok = await verifyPassword(input.password, user.password);
	if (!ok) {
		throw new InvalidCredentialsError();
	}

	if (user.forceReset) {
		const { sessionId, resetCode } = await createResetSession(db, {
			userId: user.id,
			ip: input.ip,
			remember: input.remember,
		});
		cookies.setSessionId(sessionId);
		return { status: "reset_required", resetCode };
	}

	const { sessionId, token } = await createAuthenticatedSession(db, {
		userId: user.id,
		ip: input.ip,
		remember: input.remember,
	});
	cookies.setSessionId(sessionId);
	cookies.setSessionToken(token);
	return { status: "authenticated" };
}

export async function logout(db: Db, cookies: CookieAdapter): Promise<void> {
	const sessionId = cookies.getSessionId();
	if (sessionId) {
		await invalidateSession(db, sessionId);
	}
	cookies.clear();
}
