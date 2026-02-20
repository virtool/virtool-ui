import { AdministratorRoleName } from "@administration/types";
import { hasSufficientAdminRole } from "@administration/utils";
import { cn } from "@app/utils";
import { FolderOpen, List, Settings, Tag } from "lucide-react";
import { Route, Switch } from "wouter";
import SidebarLink from "./SidebarLink";

type SidebarProps = {
    administratorRole: AdministratorRoleName;
};

/**
 * Displays the sidebar with routes to manage the component
 */
export default function Sidebar({ administratorRole }: SidebarProps) {
    const fullAdministrator = hasSufficientAdminRole(
        AdministratorRoleName.FULL,
        administratorRole,
    );

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
                        icon={List}
                    />
                </Route>
                <Route path="/samples/*?">
                    <SidebarLink
                        exclude={[
                            "/samples/uploads",
                            "/samples/labels",
                            "/samples/settings",
                        ]}
                        title="Browse"
                        link="/samples"
                        icon={List}
                    />
                    <SidebarLink
                        title="Files"
                        link="/samples/files"
                        icon={FolderOpen}
                    />
                    <SidebarLink
                        title="Labels"
                        link="/samples/labels"
                        icon={Tag}
                    />
                    {fullAdministrator ? (
                        <SidebarLink
                            title="Settings"
                            link="/samples/settings"
                            icon={Settings}
                        />
                    ) : null}
                </Route>
                <Route path="/refs/*?">
                    <SidebarLink
                        exclude={["/refs/settings"]}
                        title="Browse"
                        link="/refs"
                        icon={List}
                    />
                    {fullAdministrator ? (
                        <SidebarLink
                            title="Settings"
                            link="/refs/settings"
                            icon={Settings}
                        />
                    ) : null}
                </Route>
                <Route path="/subtractions/*?">
                    <SidebarLink
                        exclude={["/subtractions/uploads"]}
                        title="Browse"
                        link="/subtractions"
                        icon={List}
                    />
                    <SidebarLink
                        title="Files"
                        link="/subtractions/files?page=1"
                        icon={FolderOpen}
                    />
                </Route>
                <Route path="/hmm/*?">
                    <SidebarLink
                        exclude={["/hmm/settings"]}
                        title="Browse"
                        link="/hmm"
                        icon={List}
                    />
                </Route>
                <Route path="/ml/*?">
                    <SidebarLink title="Browse" link="/ml" icon={List} />
                </Route>
            </Switch>
        </div>
    );
}
