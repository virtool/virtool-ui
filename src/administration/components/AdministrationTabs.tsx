import Tabs from "@base/Tabs";
import TabsLink from "@base/TabsLink";
import { AdministratorRoleName } from "../types";
import { hasSufficientAdminRole } from "../utils";

type AdministratorTabsProps = {
    administratorRole: AdministratorRoleName;
};

export default function AdministrationTabs({
    administratorRole,
}: AdministratorTabsProps) {
    const tabs = [];

    if (
        hasSufficientAdminRole(
            AdministratorRoleName.SETTINGS,
            administratorRole,
        )
    ) {
        tabs.push(<TabsLink to="/administration/settings">Settings</TabsLink>);
    }

    if (
        hasSufficientAdminRole(AdministratorRoleName.USERS, administratorRole)
    ) {
        tabs.push(
            <TabsLink to="/administration/users?status=active">Users</TabsLink>,
        );
    }

    if (hasSufficientAdminRole(AdministratorRoleName.FULL, administratorRole)) {
        tabs.push(
            <TabsLink to="/administration/administrators">
                Administrators
            </TabsLink>,
        );
    }

    if (
        hasSufficientAdminRole(AdministratorRoleName.USERS, administratorRole)
    ) {
        tabs.push(<TabsLink to="/administration/groups">Groups</TabsLink>);
    }

    return <Tabs>{...tabs}</Tabs>;
}
