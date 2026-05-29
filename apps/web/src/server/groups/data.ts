import { asc, count, eq, ilike } from "drizzle-orm";
import type { PostgresError } from "postgres";
import { db } from "../db/pg";
import {
	type GroupPermissions,
	type GroupRow,
	groups as groupsTable,
	userGroups as userGroupsTable,
} from "../db/schema/groups";
import { users as usersTable } from "../db/schema/users";
import { AppError } from "../errors";
import { emit } from "../events/emit";

/** A user reference attached to a group, matching the legacy wire shape. */
export type GroupUserNested = {
	id: number;
	handle: string;
};

/** A minimal group record used in lists and selectors. */
export type GroupMinimal = {
	id: number;
	legacy_id: string | null;
	name: string;
};

/** A full group record including permissions and member users. */
export type Group = GroupMinimal & {
	permissions: GroupPermissions;
	users: GroupUserNested[];
};

/** A page of group search results. */
export type GroupSearchResults = {
	items: GroupMinimal[];
	found_count: number;
	total_count: number;
	page: number;
	page_count: number;
	per_page: number;
};

/** Partial values accepted when updating a group. */
export type GroupUpdateValues = {
	name?: string;
	permissions?: Partial<GroupPermissions>;
};

/** Thrown when a requested group does not exist. */
export class GroupNotFoundError extends AppError {}

/** Thrown when a group name conflicts with an existing group. */
export class GroupConflictError extends AppError {}

function isUniqueViolation(error: unknown): boolean {
	if (error === null || typeof error !== "object") {
		return false;
	}
	const cause = (error as { cause?: unknown }).cause;
	return (
		(error as Partial<PostgresError>).code === "23505" ||
		(cause !== null &&
			typeof cause === "object" &&
			(cause as Partial<PostgresError>).code === "23505")
	);
}

function generateBasePermissions(): GroupPermissions {
	return {
		cancel_job: false,
		create_ref: false,
		create_sample: false,
		modify_hmm: false,
		modify_subtraction: false,
		remove_file: false,
		remove_job: false,
		upload_file: false,
	};
}

function toGroupMinimal(row: GroupRow): GroupMinimal {
	return {
		id: row.id,
		legacy_id: row.legacyId,
		name: row.name,
	};
}

async function fetchGroupUsers(groupId: number): Promise<GroupUserNested[]> {
	const rows = await db
		.select({ id: usersTable.id, handle: usersTable.handle })
		.from(usersTable)
		.innerJoin(userGroupsTable, eq(userGroupsTable.userId, usersTable.id))
		.where(eq(userGroupsTable.groupId, groupId))
		.orderBy(asc(usersTable.handle));

	return rows.map((row) => ({ id: row.id, handle: row.handle }));
}

export async function listGroups(): Promise<GroupMinimal[]> {
	const rows = await db
		.select()
		.from(groupsTable)
		.orderBy(asc(groupsTable.name));

	return rows.map(toGroupMinimal);
}

export async function findGroups(
	term: string,
	page: number,
	perPage: number,
): Promise<GroupSearchResults> {
	const filter = term ? ilike(groupsTable.name, `%${term}%`) : undefined;
	const skip = page > 1 ? (page - 1) * perPage : 0;

	const [[foundRow], [totalRow], rows] = await Promise.all([
		db.select({ value: count() }).from(groupsTable).where(filter),
		db.select({ value: count() }).from(groupsTable),
		db
			.select()
			.from(groupsTable)
			.where(filter)
			.orderBy(asc(groupsTable.name))
			.limit(perPage)
			.offset(skip),
	]);

	const foundCount = foundRow?.value ?? 0;

	return {
		items: rows.map(toGroupMinimal),
		found_count: foundCount,
		total_count: totalRow?.value ?? 0,
		page,
		page_count: perPage > 0 ? Math.ceil(foundCount / perPage) : 0,
		per_page: perPage,
	};
}

export async function getGroup(groupId: number): Promise<Group> {
	const [row] = await db
		.select()
		.from(groupsTable)
		.where(eq(groupsTable.id, groupId));

	if (!row) {
		throw new GroupNotFoundError();
	}

	const users = await fetchGroupUsers(row.id);

	return {
		...toGroupMinimal(row),
		permissions: row.permissions,
		users,
	};
}

export async function createGroup(name: string): Promise<Group> {
	try {
		const [row] = await db
			.insert(groupsTable)
			.values({
				name,
				legacyId: null,
				permissions: generateBasePermissions(),
			})
			.returning();

		await emit("groups", row.id, "create");

		return {
			...toGroupMinimal(row),
			permissions: row.permissions,
			users: [],
		};
	} catch (error) {
		if (isUniqueViolation(error)) {
			throw new GroupConflictError();
		}
		throw error;
	}
}

export async function updateGroup(
	groupId: number,
	values: GroupUpdateValues,
): Promise<Group> {
	const [existing] = await db
		.select()
		.from(groupsTable)
		.where(eq(groupsTable.id, groupId));

	if (!existing) {
		throw new GroupNotFoundError();
	}

	const patch: Partial<typeof groupsTable.$inferInsert> = {};
	if (values.name !== undefined) {
		patch.name = values.name;
	}
	if (values.permissions !== undefined) {
		patch.permissions = { ...existing.permissions, ...values.permissions };
	}

	if (Object.keys(patch).length === 0) {
		return getGroup(groupId);
	}

	try {
		await db.update(groupsTable).set(patch).where(eq(groupsTable.id, groupId));
	} catch (error) {
		if (isUniqueViolation(error)) {
			throw new GroupConflictError();
		}
		throw error;
	}

	await emit("groups", groupId, "update");

	return getGroup(groupId);
}

export async function deleteGroup(groupId: number): Promise<void> {
	const [row] = await db
		.delete(groupsTable)
		.where(eq(groupsTable.id, groupId))
		.returning({ id: groupsTable.id });

	if (!row) {
		throw new GroupNotFoundError();
	}

	await emit("groups", row.id, "delete");
}
