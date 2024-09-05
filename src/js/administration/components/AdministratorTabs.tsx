import { Tabs, TabsLink } from "@base";
import React from "react";
import { AdministratorRoles } from "../types";
import { hasSufficientAdminRole } from "../utils";

type AdministratorTabsProps = {
    administratorRole: AdministratorRoles;
};
export function AdministratorTabs({ administratorRole }: AdministratorTabsProps) {
    const tabs = [];

    if (hasSufficientAdminRole(AdministratorRoles.SETTINGS, administratorRole)) {
        tabs.push(<TabsLink to="/settings">Settings</TabsLink>);
    }

    if (hasSufficientAdminRole(AdministratorRoles.USERS, administratorRole)) {
        tabs.push(<TabsLink to="/users?status=active">Users</TabsLink>);
    }

    if (hasSufficientAdminRole(AdministratorRoles.FULL, administratorRole)) {
        tabs.push(<TabsLink to="/administrators">Administrators</TabsLink>);
    }

    if (hasSufficientAdminRole(AdministratorRoles.USERS, administratorRole)) {
        tabs.push(<TabsLink to="/groups">Groups</TabsLink>);
    }

    return <Tabs>{...tabs}</Tabs>;
}
