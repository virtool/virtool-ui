import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { Db } from "../db/pg";
import { sessions } from "../db/schema/sessions";
import { users } from "../db/schema/users";
import { createTestDatabase, type TestDatabase } from "../db/test/fixtures";
import { SESSION_ID_COOKIE, SESSION_TOKEN_COOKIE } from "./cookies";
import { seedSession, seedUser } from "./test/fixtures";
import { newSessionToken } from "./tokens";
import {
	parseCookieHeader,
	verifyAuthenticatedSession,
	verifyRequest,
} from "./verify";

let database: TestDatabase;
let db: Db;

beforeAll(async () => {
	database = await createTestDatabase();
	db = database.db;
}, 60_000);

afterAll(async () => {
	await database.drop();
});

beforeEach(async () => {
	await db.delete(sessions);
	await db.delete(users);
});

describe("verifyAuthenticatedSession", () => {
	it("resolves the session of an active user", async () => {
		const userId = await seedUser(db);
		const { sessionId, token } = await seedSession(db, userId);

		expect(await verifyAuthenticatedSession(db, sessionId, token)).toEqual({
			userId,
		});
	});

	it("rejects a session whose user has been deactivated", async () => {
		const userId = await seedUser(db, { active: false });
		const { sessionId, token } = await seedSession(db, userId);

		expect(await verifyAuthenticatedSession(db, sessionId, token)).toBeNull();
	});

	it("rejects a session deactivated after it was issued", async () => {
		const userId = await seedUser(db);
		const { sessionId, token } = await seedSession(db, userId);

		expect(await verifyAuthenticatedSession(db, sessionId, token)).toEqual({
			userId,
		});

		await db.update(users).set({ active: false });

		expect(await verifyAuthenticatedSession(db, sessionId, token)).toBeNull();
	});

	it.each([
		["no session id", undefined, "token"],
		["no session token", "session_abc", undefined],
	])("rejects when there is %s", async (_label, sessionId, token) => {
		expect(await verifyAuthenticatedSession(db, sessionId, token)).toBeNull();
	});

	it("rejects an unknown session id", async () => {
		const userId = await seedUser(db);
		const { token } = await seedSession(db, userId);

		expect(
			await verifyAuthenticatedSession(db, "session_unknown", token),
		).toBeNull();
	});

	it("rejects a reset session", async () => {
		const userId = await seedUser(db);
		const { sessionId, token } = await seedSession(db, userId, {
			sessionType: "reset",
		});

		expect(await verifyAuthenticatedSession(db, sessionId, token)).toBeNull();
	});

	it("rejects a session with no stored token hash", async () => {
		const userId = await seedUser(db);
		const { sessionId, token } = await seedSession(db, userId, {
			withToken: false,
		});

		expect(await verifyAuthenticatedSession(db, sessionId, token)).toBeNull();
	});

	it("rejects an expired session", async () => {
		const userId = await seedUser(db);
		const { sessionId, token } = await seedSession(db, userId, {
			expiresAt: new Date(Date.now() - 1_000),
		});

		expect(await verifyAuthenticatedSession(db, sessionId, token)).toBeNull();
	});

	it("rejects a token that does not match the stored hash", async () => {
		const userId = await seedUser(db);
		const { sessionId } = await seedSession(db, userId);

		expect(
			await verifyAuthenticatedSession(db, sessionId, newSessionToken()),
		).toBeNull();
	});
});

describe("parseCookieHeader", () => {
	it("returns nothing for a request that sent no cookie header", () => {
		expect(parseCookieHeader(null)).toEqual({});
	});

	it("parses a pair of cookies", () => {
		expect(parseCookieHeader("session_id=abc; session_token=def")).toEqual({
			session_id: "abc",
			session_token: "def",
		});
	});

	it("trims the whitespace around names and values", () => {
		expect(parseCookieHeader("  session_id  =  abc  ")).toEqual({
			session_id: "abc",
		});
	});

	it("decodes a percent-encoded value", () => {
		expect(parseCookieHeader("session_id=a%20b%3Bc")).toEqual({
			session_id: "a b;c",
		});
	});

	// Splitting on the last `=` would corrupt any base64-padded value.
	it("splits on the first equals sign only", () => {
		expect(parseCookieHeader("session_token=aGk=")).toEqual({
			session_token: "aGk=",
		});
	});

	it("skips segments with no equals sign", () => {
		expect(parseCookieHeader("broken; session_id=abc")).toEqual({
			session_id: "abc",
		});
	});

	it("skips a segment with an empty name", () => {
		expect(parseCookieHeader("=orphan; session_id=abc")).toEqual({
			session_id: "abc",
		});
	});

	it("keeps a cookie with an empty value", () => {
		expect(parseCookieHeader("session_id=")).toEqual({ session_id: "" });
	});
});

describe("verifyRequest", () => {
	function request(cookie: string): Request {
		return new Request("https://virtool.test/events", {
			headers: { cookie },
		});
	}

	it("rejects a request that sent no cookies at all", async () => {
		expect(
			await verifyRequest(db, new Request("https://virtool.test/events")),
		).toBeNull();
	});

	it("resolves the session from the cookie header", async () => {
		const userId = await seedUser(db);
		const { sessionId, token } = await seedSession(db, userId);

		const session = await verifyRequest(
			db,
			request(
				`${SESSION_ID_COOKIE}=${sessionId}; ${SESSION_TOKEN_COOKIE}=${token}`,
			),
		);

		expect(session).toEqual({ userId });
	});

	it("rejects the cookie header of a deactivated user", async () => {
		const userId = await seedUser(db, { active: false });
		const { sessionId, token } = await seedSession(db, userId);

		const session = await verifyRequest(
			db,
			request(
				`${SESSION_ID_COOKIE}=${sessionId}; ${SESSION_TOKEN_COOKIE}=${token}`,
			),
		);

		expect(session).toBeNull();
	});
});
