import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { verifyPassword } from "../auth/password";
import { seedSession, seedUser } from "../auth/test/fixtures";
import type { Db } from "../db/pg";
import { sessions } from "../db/schema/sessions";
import { users } from "../db/schema/users";
import { createTestDatabase, type TestDatabase } from "../db/test/fixtures";
import {
	GroupMembershipError,
	getAccount,
	UserNotFoundError,
	updateUser,
} from "./data";

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
	await db.delete(users);
});

const settings = {
	quick_analyze_workflow: "nuvs",
	show_ids: false,
	show_versions: true,
	skip_quick_analyze_dialog: false,
};

describe("getAccount", () => {
	it("returns the email and settings that only the account holder may read", async () => {
		const userId = await seedUser(db, {
			email: "alice@example.com",
			handle: "alice",
			settings,
		});

		const account = await getAccount(db, userId);

		expect(account.email).toBe("alice@example.com");
		expect(account.settings).toEqual(settings);
	});

	it("returns the same user fields the administration views see", async () => {
		const userId = await seedUser(db, {
			administratorRole: "full",
			handle: "alice",
		});

		const account = await getAccount(db, userId);

		expect(account).toMatchObject({
			id: userId,
			handle: "alice",
			administrator_role: "full",
			active: true,
			force_reset: false,
			groups: [],
			primary_group: null,
		});
	});

	// The route guards on /login and /_authenticated read a rejection as "nobody
	// is signed in", so this must throw rather than resolve undefined.
	it("throws when the user does not exist", async () => {
		await expect(getAccount(db, 404)).rejects.toBeInstanceOf(UserNotFoundError);
	});
});

async function countSessions(userId: number): Promise<number> {
	const rows = await db
		.select({ sessionId: sessions.sessionId })
		.from(sessions)
		.where(eq(sessions.userId, userId));
	return rows.length;
}

async function readUser(userId: number) {
	const [row] = await db.select().from(users).where(eq(users.id, userId));
	return row;
}

describe("updateUser", () => {
	it("deletes the user's sessions when they are deactivated", async () => {
		const userId = await seedUser(db);
		await seedSession(db, userId);
		await seedSession(db, userId);

		await updateUser(db, userId, { active: false });

		expect(await countSessions(userId)).toBe(0);
		expect((await readUser(userId))?.active).toBe(false);
	});

	it("deletes the user's sessions when their password changes", async () => {
		const userId = await seedUser(db);
		await seedSession(db, userId);
		const before = await readUser(userId);

		await updateUser(db, userId, { password: "new-password-1234" });

		expect(await countSessions(userId)).toBe(0);
		const after = await readUser(userId);
		expect(
			await verifyPassword("new-password-1234", after?.password as Buffer),
		).toBe(true);
		expect(after?.lastPasswordChange.getTime()).toBeGreaterThan(
			before?.lastPasswordChange.getTime() ?? 0,
		);
	});

	it("deletes the user's sessions when force_reset is set", async () => {
		const userId = await seedUser(db);
		await seedSession(db, userId);

		await updateUser(db, userId, { force_reset: true });

		expect(await countSessions(userId)).toBe(0);
		expect((await readUser(userId))?.forceReset).toBe(true);
	});

	it("leaves sessions alone when only the handle changes", async () => {
		const userId = await seedUser(db);
		await seedSession(db, userId);

		await updateUser(db, userId, { handle: "renamed" });

		expect(await countSessions(userId)).toBe(1);
		expect((await readUser(userId))?.handle).toBe("renamed");
	});

	it("leaves sessions alone when only group membership changes", async () => {
		const userId = await seedUser(db);
		await seedSession(db, userId);

		await updateUser(db, userId, { groups: [] });

		expect(await countSessions(userId)).toBe(1);
	});

	it("revokes only the target user's sessions", async () => {
		const alice = await seedUser(db, { handle: "alice" });
		const bob = await seedUser(db, { handle: "bob" });
		await seedSession(db, alice);
		await seedSession(db, bob);

		await updateUser(db, alice, { active: false });

		expect(await countSessions(alice)).toBe(0);
		expect(await countSessions(bob)).toBe(1);
	});

	it("rolls back the deactivation and the session deletion together on failure", async () => {
		const userId = await seedUser(db);
		await seedSession(db, userId);

		// Pairing the deactivation with a primary_group the user does not belong to
		// makes the promote fail inside the same transaction, so nothing commits.
		await expect(
			updateUser(db, userId, { active: false, primary_group: 999 }),
		).rejects.toBeInstanceOf(GroupMembershipError);

		expect(await countSessions(userId)).toBe(1);
		expect((await readUser(userId))?.active).toBe(true);
	});
});
