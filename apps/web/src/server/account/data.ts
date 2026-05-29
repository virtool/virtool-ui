import { asc, eq } from "drizzle-orm";
import type { Db } from "../db/pg";
import {
	type GroupPermissions,
	groups as groupsTable,
	userGroups as userGroupsTable,
} from "../db/schema/groups";
import { users as usersTable } from "../db/schema/users";
import { AppError } from "../errors";

/** An administrator role, or null for non-administrators. */
export type AdministratorRole =
	| "full"
	| "settings"
	| "spaces"
	| "users"
	| "base"
	| null;

/** A minimal group reference attached to an account. */
export type AccountGroup = {
	id: number;
	legacy_id: string | null;
	name: string;
};

/** A user's quick-analyze workflow preference. */
export type QuickAnalyzeWorkflow = "nuvs" | "pathoscope";

/** Per-user interface and analysis preferences. */
export type AccountSettings = {
	quick_analyze_workflow: QuickAnalyzeWorkflow;
	show_ids: boolean;
	show_versions: boolean;
	skip_quick_analyze_dialog: boolean;
};

/** The authenticated user's account, matching the legacy wire shape. */
export type Account = {
	id: number;
	handle: string;
	administrator_role: AdministratorRole;
	active: boolean;
	email: string;
	force_reset: boolean;
	groups: AccountGroup[];
	last_password_change: string;
	permissions: GroupPermissions;
	primary_group: AccountGroup | null;
	settings: AccountSettings;
};

/** Thrown when the authenticated user has no account row. */
export class AccountNotFoundError extends AppError {}

const DEFAULT_SETTINGS: AccountSettings = {
	quick_analyze_workflow: "pathoscope",
	show_ids: true,
	show_versions: true,
	skip_quick_analyze_dialog: true,
};

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

/**
 * Merge the permissions granted by membership in a list of groups.
 *
 * A permission is granted to the user when any of their groups grants it.
 */
function mergeGroupPermissions(
	groupPermissions: GroupPermissions[],
): GroupPermissions {
	const merged = generateBasePermissions();

	for (const permissions of groupPermissions) {
		for (const key of Object.keys(merged) as Array<keyof GroupPermissions>) {
			if (permissions[key]) {
				merged[key] = true;
			}
		}
	}

	return merged;
}

function toAccountSettings(raw: Record<string, unknown>): AccountSettings {
	return { ...DEFAULT_SETTINGS, ...(raw as Partial<AccountSettings>) };
}

export async function getAccount(db: Db, userId: number): Promise<Account> {
	const [[user], groupRows] = await Promise.all([
		db.select().from(usersTable).where(eq(usersTable.id, userId)),
		db
			.select({
				id: groupsTable.id,
				legacyId: groupsTable.legacyId,
				name: groupsTable.name,
				permissions: groupsTable.permissions,
				primary: userGroupsTable.primary,
			})
			.from(userGroupsTable)
			.innerJoin(groupsTable, eq(groupsTable.id, userGroupsTable.groupId))
			.where(eq(userGroupsTable.userId, userId))
			.orderBy(asc(groupsTable.name)),
	]);

	if (!user) {
		throw new AccountNotFoundError();
	}

	const groups: AccountGroup[] = groupRows.map((row) => ({
		id: row.id,
		legacy_id: row.legacyId,
		name: row.name,
	}));

	const primaryRow = groupRows.find((row) => row.primary);

	return {
		id: user.id,
		handle: user.handle,
		administrator_role: user.administratorRole,
		active: user.active,
		email: user.email,
		force_reset: user.forceReset,
		groups,
		last_password_change: user.lastPasswordChange.toISOString(),
		permissions: mergeGroupPermissions(groupRows.map((row) => row.permissions)),
		primary_group: primaryRow
			? {
					id: primaryRow.id,
					legacy_id: primaryRow.legacyId,
					name: primaryRow.name,
				}
			: null,
		settings: toAccountSettings(user.settings),
	};
}
