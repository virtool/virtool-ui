import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { seedUser } from "../auth/test/fixtures";
import type { Db } from "../db/pg";
import { apiKeys } from "../db/schema/apiKeys";
import type { GroupPermissions } from "../db/schema/groups";
import { groups, userGroups } from "../db/schema/groups";
import { users } from "../db/schema/users";
import { createTestDatabase, type TestDatabase } from "../db/test/fixtures";
import { addToGroup, NO_PERMISSIONS, seedGroup } from "../groups/test/fixtures";
import {
	ApiKeyNotFoundError,
	createApiKey,
	deleteApiKey,
	findApiKeys,
	getApiKey,
	updateApiKey,
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
	await db.delete(apiKeys);
	await db.delete(userGroups);
	await db.delete(users);
	await db.delete(groups);
});

function perms(overrides: Partial<GroupPermissions> = {}): GroupPermissions {
	return { ...NO_PERMISSIONS, ...overrides };
}

/** Seed a non-administrator user granted a single permission through a group. */
async function seedLimitedUser(): Promise<number> {
	const userId = await seedUser(db);
	const groupId = await seedGroup(db, { permissions: { create_sample: true } });
	await addToGroup(db, userId, groupId);
	return userId;
}

describe("createApiKey", () => {
	it("stores the requested permissions and returns the raw secret once", async () => {
		const userId = await seedUser(db, { administratorRole: "full" });

		const { key, apiKey } = await createApiKey(db, userId, {
			name: "Robot",
			permissions: perms({ create_ref: true }),
		});

		expect(key).toMatch(/^[0-9a-f]{64}$/);
		expect(apiKey.name).toBe("Robot");
		expect(apiKey.permissions).toEqual(perms({ create_ref: true }));

		const [row] = await db.select().from(apiKeys);
		expect(row?.permissions).toEqual(perms({ create_ref: true }));
		// The raw secret is never persisted — only its hash.
		expect(row?.hashed).not.toBe(key);
	});

	it("clamps the returned permissions to a non-admin owner's permissions", async () => {
		const userId = await seedLimitedUser();

		const { apiKey } = await createApiKey(db, userId, {
			name: "Robot",
			permissions: perms({ create_ref: true, create_sample: true }),
		});

		// create_ref is dropped — the owner does not hold it — but create_sample
		// survives.
		expect(apiKey.permissions).toEqual(perms({ create_sample: true }));
	});
});

describe("findApiKeys", () => {
	it("lists the owner's keys with their stored, unclamped permissions", async () => {
		const userId = await seedLimitedUser();
		await createApiKey(db, userId, {
			name: "Robot",
			permissions: perms({ create_ref: true, create_sample: true }),
		});

		const keys = await findApiKeys(db, userId);

		expect(keys).toHaveLength(1);
		// Unlike the single-key read, the list is not clamped.
		expect(keys[0]?.permissions).toEqual(
			perms({ create_ref: true, create_sample: true }),
		);
	});

	it("expands sparse legacy permissions to the full checklist", async () => {
		const userId = await seedUser(db, { administratorRole: "full" });
		// The legacy Python path stored only the provided permission keys.
		await db.insert(apiKeys).values({
			hashed: "legacy",
			name: "Legacy",
			createdAt: new Date(),
			userId,
			permissions: { create_ref: true } as GroupPermissions,
		});

		const keys = await findApiKeys(db, userId);

		expect(keys[0]?.permissions).toEqual(perms({ create_ref: true }));
	});

	it("does not return another user's keys", async () => {
		const owner = await seedUser(db, { handle: "owner" });
		const other = await seedUser(db, { handle: "other" });
		await createApiKey(db, owner, { name: "Robot", permissions: perms() });

		expect(await findApiKeys(db, other)).toHaveLength(0);
	});
});

describe("getApiKey", () => {
	it("clamps a non-admin owner's permissions", async () => {
		const userId = await seedLimitedUser();
		const { apiKey } = await createApiKey(db, userId, {
			name: "Robot",
			permissions: perms({ create_ref: true, create_sample: true }),
		});

		const read = await getApiKey(db, userId, apiKey.id);

		expect(read.permissions).toEqual(perms({ create_sample: true }));
	});

	it("does not clamp an administrator owner's permissions", async () => {
		const userId = await seedUser(db, { administratorRole: "full" });
		const { apiKey } = await createApiKey(db, userId, {
			name: "Robot",
			permissions: perms({ create_ref: true }),
		});

		const read = await getApiKey(db, userId, apiKey.id);

		expect(read.permissions).toEqual(perms({ create_ref: true }));
	});

	it("throws when the key belongs to another user", async () => {
		const owner = await seedUser(db, { handle: "owner" });
		const other = await seedUser(db, { handle: "other" });
		const { apiKey } = await createApiKey(db, owner, {
			name: "Robot",
			permissions: perms(),
		});

		await expect(getApiKey(db, other, apiKey.id)).rejects.toBeInstanceOf(
			ApiKeyNotFoundError,
		);
	});
});

describe("updateApiKey", () => {
	it("merges the update into the stored permissions", async () => {
		const userId = await seedUser(db, { administratorRole: "full" });
		const { apiKey } = await createApiKey(db, userId, {
			name: "Robot",
			permissions: perms({ create_ref: true }),
		});

		const updated = await updateApiKey(db, userId, apiKey.id, {
			create_sample: true,
		});

		expect(updated.permissions).toEqual(
			perms({ create_ref: true, create_sample: true }),
		);
	});

	it("throws when the key does not exist", async () => {
		const userId = await seedUser(db);

		await expect(
			updateApiKey(db, userId, 404, { create_ref: true }),
		).rejects.toBeInstanceOf(ApiKeyNotFoundError);
	});
});

describe("deleteApiKey", () => {
	it("removes the key", async () => {
		const userId = await seedUser(db);
		const { apiKey } = await createApiKey(db, userId, {
			name: "Robot",
			permissions: perms(),
		});

		await deleteApiKey(db, userId, apiKey.id);

		expect(await findApiKeys(db, userId)).toHaveLength(0);
	});

	it("throws when the key does not exist", async () => {
		const userId = await seedUser(db);

		await expect(deleteApiKey(db, userId, 404)).rejects.toBeInstanceOf(
			ApiKeyNotFoundError,
		);
	});
});
