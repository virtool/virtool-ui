import Tabs from "@base/Tabs";
import TabsLink from "@base/TabsLink";
import type { AdministratorRoleName } from "../types";
import { hasSufficientAdminRole } from "../utils";

type AdministratorTabsProps = {
	administratorRole: AdministratorRoleName | null;
};

export default function AdministrationTabs({
	administratorRole,
}: AdministratorTabsProps) {
	const tabs = [];

	if (hasSufficientAdminRole("settings", administratorRole)) {
		tabs.push(<TabsLink to="/administration/settings">Settings</TabsLink>);
	}

	if (hasSufficientAdminRole("users", administratorRole)) {
		tabs.push(
			<TabsLink to="/administration/users?status=active">Users</TabsLink>,
		);
		tabs.push(<TabsLink to="/administration/groups">Groups</TabsLink>);
	}

	return <Tabs>{...tabs}</Tabs>;
}
