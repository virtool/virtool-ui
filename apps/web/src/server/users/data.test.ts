import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { seedUser } from "../auth/test/fixtures";
import type { Db } from "../db/pg";
import { users } from "../db/schema/users";
import { createTestDatabase, type TestDatabase } from "../db/test/fixtures";
import { getAccount, UserNotFoundError } from "./data";

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
