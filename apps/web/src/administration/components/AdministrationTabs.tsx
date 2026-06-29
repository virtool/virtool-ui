import NavTab from "@base/NavTab";
import NavTabs from "@base/NavTabs";
import type { ReactNode } from "react";
import type { AdministratorRoleName } from "../types";
import { hasSufficientAdminRole } from "../utils";

type AdministratorTabsProps = {
	administratorRole: AdministratorRoleName | null;
};

export default function AdministrationTabs({
	administratorRole,
}: AdministratorTabsProps) {
	const tabs: ReactNode[] = [];

	if (hasSufficientAdminRole("settings", administratorRole)) {
		tabs.push(<NavTab to="/administration/settings">Settings</NavTab>);
	}

	if (hasSufficientAdminRole("users", administratorRole)) {
		tabs.push(<NavTab to="/administration/users?status=active">Users</NavTab>);
		tabs.push(<NavTab to="/administration/groups">Groups</NavTab>);
	}

	return <NavTabs>{tabs}</NavTabs>;
}
