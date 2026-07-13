import type { Db } from "../../db/pg";
import { sessions } from "../../db/schema/sessions";
import { users } from "../../db/schema/users";
import { hashToken, newSessionId, newSessionToken } from "../tokens";

/** A seeded session and the plaintext token that authenticates it. */
export type SeededSession = {
	sessionId: string;
	token: string;
	userId: number;
};

/** Insert a user, active unless told otherwise, and return its id. */
export async function seedUser(
	db: Db,
	{
		active = true,
		handle = "alice",
	}: { active?: boolean; handle?: string } = {},
): Promise<number> {
	const [user] = await db
		.insert(users)
		.values({
			active,
			handle,
			lastPasswordChange: new Date(),
			password: Buffer.from("not-a-real-hash"),
			settings: {},
		})
		.returning({ id: users.id });

	if (!user) {
		throw new Error("failed to seed user");
	}

	return user.id;
}

/**
 * Insert a session for `userId`. Only the token's hash is stored, so the
 * plaintext is returned — it is the only way a caller can authenticate as this
 * session afterwards.
 */
export async function seedSession(
	db: Db,
	userId: number,
	{
		expiresAt = new Date(Date.now() + 60_000),
		sessionType = "authenticated" as const,
		withToken = true,
	}: {
		expiresAt?: Date;
		sessionType?: "anonymous" | "authenticated" | "reset";
		withToken?: boolean;
	} = {},
): Promise<SeededSession> {
	const sessionId = newSessionId();
	const token = newSessionToken();

	await db.insert(sessions).values({
		createdAt: new Date(),
		expiresAt,
		ip: "127.0.0.1",
		sessionId,
		sessionType,
		tokenHash: withToken ? hashToken(token) : null,
		userId,
	});

	return { sessionId, token, userId };
}
