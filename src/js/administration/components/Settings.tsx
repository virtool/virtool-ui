import { useFetchAccount } from "@account/queries";
import { ContainerNarrow, ContainerWide, LoadingPlaceholder, ViewHeader, ViewHeaderTitle } from "@base";
import { ManageUsers } from "@users/components/ManageUsers";
import UserDetail from "@users/components/UserDetail";
import React from "react";
import { Redirect, Route, Switch } from "wouter";
import Groups from "../../groups/components/Groups";
import { AdministratorRoles } from "../types";
import { hasSufficientAdminRole } from "../utils";
import { ManageAdministrators } from "./administrators/Administrators";
import { AdministratorTabs } from "./AdministratorTabs";
import { ServerSettings } from "./ServerSettings";

export default function Settings() {
    const { data: account, isPending } = useFetchAccount();

    const redirect = hasSufficientAdminRole(AdministratorRoles.SETTINGS, account?.administrator_role)
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
                    <AdministratorTabs administratorRole={account.administrator_role} />
                    <ContainerNarrow>
                        <Switch>
                            <Route path="/" component={() => <Redirect to={`/${redirect}`} replace />} />
                            <Route path="/settings" component={ServerSettings} nest />
                            <Route path="/users/:userId" component={UserDetail} nest />
                            <Route path="/users" component={ManageUsers} nest />
                            <Route path="/groups" component={Groups} nest />
                            <Route path="/administrators" component={ManageAdministrators} nest />
                        </Switch>
                    </ContainerNarrow>
                </>
            )}
        </ContainerWide>
    );
}
