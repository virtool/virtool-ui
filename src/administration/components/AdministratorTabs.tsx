import Tabs from "../../base/Tabs";
import TabsLink from "../../base/TabsLink";
import React from "react";
import { AdministratorRoles } from "../types";
import { hasSufficientAdminRole } from "../utils";

type AdministratorTabsProps = {
    administratorRole: AdministratorRoles;
};
export function AdministratorTabs({
    administratorRole,
}: AdministratorTabsProps) {
    const tabs = [];

    if (
        hasSufficientAdminRole(AdministratorRoles.SETTINGS, administratorRole)
    ) {
        tabs.push(<TabsLink to="/administration/settings">Settings</TabsLink>);
    }

    if (hasSufficientAdminRole(AdministratorRoles.USERS, administratorRole)) {
        tabs.push(
            <TabsLink to="/administration/users?status=active">Users</TabsLink>,
        );
    }

    if (hasSufficientAdminRole(AdministratorRoles.FULL, administratorRole)) {
        tabs.push(
            <TabsLink to="/administration/administrators">
                Administrators
            </TabsLink>,
        );
    }

    if (hasSufficientAdminRole(AdministratorRoles.USERS, administratorRole)) {
        tabs.push(<TabsLink to="/administration/groups">Groups</TabsLink>);
    }

    return <Tabs>{...tabs}</Tabs>;
}
