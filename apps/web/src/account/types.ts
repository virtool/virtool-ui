import type { AdministratorRoleName } from "@administration/types";
import type { GroupMinimal, Permissions } from "@groups/types";
import type { User } from "@users/types";

export type QuickAnalyzeWorkflow = "nuvs" | "pathoscope";

export type APIKeyMinimal = {
	created_at?: string;
	groups: Array<GroupMinimal>;
	id: string;
	key?: string;
	name: string;
	permissions: Permissions;
};

export type AccountSettings = {
	quick_analyze_workflow: QuickAnalyzeWorkflow;
	show_ids: boolean;
	show_versions: boolean;
	skip_quick_analyze_dialog: boolean;
};

/** The logged-in user's account data. */
export type Account = Omit<User, "administrator_role" | "primary_group"> & {
	/** The user's administrator role, or null if they have no administrative access. */
	administrator_role: AdministratorRoleName | null;
	/** The user's primary group, or null if they have no primary group set. */
	primary_group: GroupMinimal | null;
	settings: AccountSettings;
	email?: string;
};
