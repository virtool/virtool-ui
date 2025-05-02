import { cn } from "@/utils";
import { AdministratorRoles } from "@administration/types";
import { hasSufficientAdminRole } from "@administration/utils";
import React from "react";
import { Route, Switch } from "wouter";
import SidebarLink from "./SidebarLink";

type SidebarProps = {
    administratorRole: AdministratorRoles;
};

/**
 * Displays the sidebar with routes to manage the component
 */
export default function Sidebar({ administratorRole }: SidebarProps) {
    const fullAdministrator = hasSufficientAdminRole(
        AdministratorRoles.FULL,
        administratorRole,
    );

    // const StyledSidebar = styled.nav`
    //     align-items: center;
    //     top: 45px;
    //     left: 0;
    //     bottom: 0;
    //     display: flex;
    //     flex-direction: column;
    //     width: 78px;
    //     padding: 45px 0 0 15px;
    // `;

    return (
        <div
            className={cn(
                "items-center",
                "flex flex-col",
                "bottom-0 left-0 top-30",
                "fixed",
                "pl-6 pb-2",
            )}
        >
            <Switch>
                <Route path="/jobs/*?">
                    <SidebarLink
                        exclude={["/jobs/settings"]}
                        title="Browse"
                        link="/jobs"
                        icon="th-list"
                    />
                </Route>
                <Route path="/samples/*?">
                    <SidebarLink
                        exclude={[
                            "/samples/files",
                            "/samples/labels",
                            "/samples/settings",
                        ]}
                        title="Browse"
                        link="/samples"
                        icon="th-list"
                    />
                    <SidebarLink
                        title="Files"
                        link="/samples/files"
                        icon="folder-open"
                    />
                    <SidebarLink
                        title="Labels"
                        link="/samples/labels"
                        icon="fas fa-tag"
                    />
                    {fullAdministrator ? (
                        <SidebarLink
                            title="Settings"
                            link="/samples/settings"
                            icon="cogs"
                        />
                    ) : null}
                </Route>
                <Route path="/refs/*?">
                    <SidebarLink
                        exclude={["/refs/settings"]}
                        title="Browse"
                        link="/refs"
                        icon="th-list"
                    />
                    {fullAdministrator ? (
                        <SidebarLink
                            title="Settings"
                            link="/refs/settings"
                            icon="cogs"
                        />
                    ) : null}
                </Route>
                <Route path="/subtractions/*?">
                    <SidebarLink
                        exclude={["/subtractions/files"]}
                        title="Browse"
                        link="/subtractions"
                        icon="th-list"
                    />
                    <SidebarLink
                        title="Files"
                        link="/subtractions/files?page=1"
                        icon="folder-open"
                    />
                </Route>
                <Route path="/hmm/*?">
                    <SidebarLink
                        exclude={["/hmm/settings"]}
                        title="Browse"
                        link="/hmm"
                        icon="th-list"
                    />
                </Route>
                <Route path="/ml/*?">
                    <SidebarLink title="Browse" link="/ml" icon="th-list" />
                </Route>
            </Switch>
        </div>
    );
}
