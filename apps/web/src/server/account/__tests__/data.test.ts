import { describe, expect, it } from "vitest";
import type { Db } from "../../db/pg";
import type { GroupPermissions } from "../../db/schema/groups";
import { type UserRow, users } from "../../db/schema/users";
import { AccountNotFoundError, getAccount } from "../data";

type GroupRow = {
	id: number;
	legacyId: string | null;
	name: string;
	permissions: GroupPermissions;
	primary: boolean;
};

function createPermissions(
	overrides: Partial<GroupPermissions> = {},
): GroupPermissions {
	return {
		cancel_job: false,
		create_ref: false,
		create_sample: false,
		modify_hmm: false,
		modify_subtraction: false,
		remove_file: false,
		remove_job: false,
		upload_file: false,
		...overrides,
	};
}

function createUserRow(overrides: Partial<UserRow> = {}): UserRow {
	return {
		id: 7,
		active: true,
		administratorRole: null,
		email: "ian@example.com",
		forceReset: false,
		handle: "ianb",
		invalidateSessions: false,
		lastPasswordChange: new Date("2024-01-02T03:04:05.000Z"),
		legacyId: null,
		password: Buffer.from(""),
		settings: {},
		...overrides,
	};
}

function createGroupRow(overrides: Partial<GroupRow> = {}): GroupRow {
	return {
		id: 1,
		legacyId: null,
		name: "Group",
		permissions: createPermissions(),
		primary: false,
		...overrides,
	};
}

// A minimal stand-in for the Drizzle handle. `getAccount` runs two awaited
// queries; the chainable, thenable builder resolves to the user rows or the
// group rows depending on which table `.from()` was given. Drizzle's `import
// type` keeps the real Postgres client out of this test.
function createFakeDb(userRows: UserRow[], groupRows: GroupRow[]): Db {
	function createBuilder() {
		let rows: unknown[] = [];
		const builder = {
			from(table: unknown) {
				rows = table === users ? userRows : groupRows;
				return builder;
			},
			where: () => builder,
			innerJoin: () => builder,
			orderBy: () => builder,
			// biome-ignore lint/suspicious/noThenProperty: a Drizzle query builder is awaitable; the fake intentionally mirrors that thenable contract.
			then(
				onFulfilled: (value: unknown[]) => unknown,
				onRejected?: (reason: unknown) => unknown,
			) {
				return Promise.resolve(rows).then(onFulfilled, onRejected);
			},
		};
		return builder;
	}

	return { select: () => createBuilder() } as unknown as Db;
}

describe("getAccount", () => {
	it("throws AccountNotFoundError when the user row is missing", async () => {
		await expect(getAccount(createFakeDb([], []), 7)).rejects.toBeInstanceOf(
			AccountNotFoundError,
		);
	});

	it("merges permissions granted by any of the user's groups", async () => {
		const db = createFakeDb(
			[createUserRow()],
			[
				createGroupRow({
					permissions: createPermissions({ create_ref: true }),
				}),
				createGroupRow({
					permissions: createPermissions({ cancel_job: true }),
				}),
			],
		);

		const { permissions } = await getAccount(db, 7);

		expect(permissions.create_ref).toBe(true);
		expect(permissions.cancel_job).toBe(true);
		expect(permissions.upload_file).toBe(false);
	});

	it("resolves the primary group from the user_groups primary flag", async () => {
		const db = createFakeDb(
			[createUserRow()],
			[
				createGroupRow({ id: 1, name: "Alpha", primary: false }),
				createGroupRow({
					id: 2,
					legacyId: "grp-2",
					name: "Bravo",
					primary: true,
				}),
			],
		);

		const { primary_group } = await getAccount(db, 7);

		expect(primary_group).toEqual({ id: 2, legacy_id: "grp-2", name: "Bravo" });
	});

	it("returns a null primary group when no group is primary", async () => {
		const db = createFakeDb([createUserRow()], [createGroupRow()]);

		expect((await getAccount(db, 7)).primary_group).toBeNull();
	});

	it("maps groups to id, legacy_id and name only", async () => {
		const db = createFakeDb(
			[createUserRow()],
			[
				createGroupRow({
					id: 3,
					legacyId: "grp-3",
					name: "Gamma",
					permissions: createPermissions({ create_ref: true }),
					primary: true,
				}),
			],
		);

		const { groups } = await getAccount(db, 7);

		expect(groups).toEqual([{ id: 3, legacy_id: "grp-3", name: "Gamma" }]);
	});

	it("coerces stored settings over the defaults", async () => {
		const db = createFakeDb(
			[createUserRow({ settings: { show_ids: false } })],
			[],
		);

		expect((await getAccount(db, 7)).settings).toEqual({
			quick_analyze_workflow: "pathoscope",
			show_ids: false,
			show_versions: true,
			skip_quick_analyze_dialog: true,
		});
	});

	it("serialises last_password_change as an ISO string", async () => {
		const db = createFakeDb(
			[
				createUserRow({
					lastPasswordChange: new Date("2024-01-02T03:04:05.000Z"),
				}),
			],
			[],
		);

		expect((await getAccount(db, 7)).last_password_change).toBe(
			"2024-01-02T03:04:05.000Z",
		);
	});
});
