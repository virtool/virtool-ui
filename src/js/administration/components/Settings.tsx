import { useFetchAccount } from "@account/queries";
import {
    ContainerNarrow,
    ContainerWide,
    LoadingPlaceholder,
    ViewHeader,
    ViewHeaderTitle,
} from "@/base";
import { ManageUsers } from "@users/components/ManageUsers";
import UserDetail from "@users/components/UserDetail";
import React from "react";
import { Redirect, Route, Switch } from "wouter";
import Groups from "../../groups/components/Groups";
import { AdministratorRoles } from "../types";
import { hasSufficientAdminRole } from "../utils";
import { AdministratorTabs } from "./AdministratorTabs";
import { ServerSettings } from "./ServerSettings";
import { ManageAdministrators } from "./administrators/Administrators";

export default function Settings() {
    const { data: account, isPending } = useFetchAccount();

    const redirect = hasSufficientAdminRole(
        AdministratorRoles.SETTINGS,
        account?.administrator_role,
    )
        ? "settings"
        : "users";

    return (
        <ContainerWide>
            <ViewHeader title="Administration">
                <ViewHeaderTitle>Administration</ViewHeaderTitle>
            </ViewHeader>

            {isPending ? (
                <LoadingPlaceholder />
            ) : (
                <>
                    <AdministratorTabs
                        administratorRole={account.administrator_role}
                    />
                    <ContainerNarrow>
                        <Switch>
                            <Route
                                path="/administration"
                                component={() => (
                                    <Redirect
                                        to={`/administration/${redirect}`}
                                        replace
                                    />
                                )}
                            />
                            <Route
                                path="/administration/settings"
                                component={ServerSettings}
                            />
                            <Route
                                path="/administration/users/:userId"
                                component={UserDetail}
                            />
                            <Route
                                path="/administration/users"
                                component={ManageUsers}
                            />
                            <Route
                                path="/administration/groups"
                                component={Groups}
                            />
                            <Route
                                path="/administration/administrators"
                                component={ManageAdministrators}
                            />
                        </Switch>
                    </ContainerNarrow>
                </>
            )}
        </ContainerWide>
    );
}
