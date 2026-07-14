import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

import type { Db } from "../db/pg";
import { takeFirstOrThrow } from "../db/rows";
import { type GroupPermissions, groups, userGroups } from "../db/schema/groups";
import { sessions } from "../db/schema/sessions";
import { users } from "../db/schema/users";
import { createTestDatabase, type TestDatabase } from "../db/test/fixtures";

vi.mock("@tanstack/react-start/server", () => ({
	deleteCookie: vi.fn(),
	getCookie: vi.fn(),
	getRequest: vi.fn(),
	setCookie: vi.fn(),
	setResponseStatus: vi.fn(),
}));

let db: Db;
vi.mock("../db/pg", () => ({
	client: {},
	get db() {
		return db;
	},
}));

const { hasPermission } = await import("./policy");
const { seedUser } = await import("./test/fixtures");

let database: TestDatabase;

beforeAll(async () => {
	database = await createTestDatabase();
	db = database.db;
}, 60_000);

afterAll(async () => {
	await database.drop();
});

beforeEach(async () => {
	await db.delete(userGroups);
	await db.delete(sessions);
	await db.delete(users);
	await db.delete(groups);
});

const NO_PERMISSIONS: GroupPermissions = {
	cancel_job: false,
	create_ref: false,
	create_sample: false,
	modify_hmm: false,
	modify_subtraction: false,
	remove_file: false,
	remove_job: false,
	upload_file: false,
};

async function seedGroup(
	name: string,
	permissions: Partial<GroupPermissions>,
): Promise<number> {
	const row = takeFirstOrThrow(
		await db
			.insert(groups)
			.values({
				legacyId: null,
				name,
				permissions: { ...NO_PERMISSIONS, ...permissions },
			})
			.returning({ id: groups.id }),
	);

	return row.id;
}

async function addToGroup(userId: number, groupId: number): Promise<void> {
	await db.insert(userGroups).values({ groupId, userId });
}

describe("hasPermission", () => {
	it("denies a user in no groups", async () => {
		const userId = await seedUser(db);

		expect(await hasPermission({ userId }, "create_sample")).toBe(false);
	});

	it("grants a permission carried by one of the user's groups", async () => {
		const userId = await seedUser(db);
		const groupId = await seedGroup("technicians", { create_sample: true });
		await addToGroup(userId, groupId);

		expect(await hasPermission({ userId }, "create_sample")).toBe(true);
	});

	it("denies a permission none of the user's groups carry", async () => {
		const userId = await seedUser(db);
		const groupId = await seedGroup("technicians", { create_sample: true });
		await addToGroup(userId, groupId);

		expect(await hasPermission({ userId }, "remove_file")).toBe(false);
	});

	// Permissions are the union across a user's groups, not the intersection.
	it("unions the permissions of every group the user belongs to", async () => {
		const userId = await seedUser(db);
		const samplers = await seedGroup("samplers", { create_sample: true });
		const uploaders = await seedGroup("uploaders", { upload_file: true });
		await addToGroup(userId, samplers);
		await addToGroup(userId, uploaders);

		expect(await hasPermission({ userId }, "create_sample")).toBe(true);
		expect(await hasPermission({ userId }, "upload_file")).toBe(true);
	});

	// `create_ref` maps to the `base` role, so any administrator covers it even
	// with no group granting it. This mirrors the client's
	// checkAdminRoleOrPermissionsFromAccount.
	it("grants a base administrator a permission their role covers", async () => {
		const userId = await seedUser(db, { administratorRole: "base" });

		expect(await hasPermission({ userId }, "create_ref")).toBe(true);
	});

	// `upload_file` maps to `full`, which `base` does not satisfy.
	it("denies a base administrator a permission their role does not cover", async () => {
		const userId = await seedUser(db, { administratorRole: "base" });

		expect(await hasPermission({ userId }, "upload_file")).toBe(false);
	});

	it("grants a full administrator any permission", async () => {
		const userId = await seedUser(db, { administratorRole: "full" });

		expect(await hasPermission({ userId }, "upload_file")).toBe(true);
		expect(await hasPermission({ userId }, "create_sample")).toBe(true);
	});

	it("denies a session whose user no longer exists", async () => {
		expect(await hasPermission({ userId: 404 }, "create_sample")).toBe(false);
	});
});
