import React from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ContainerNarrow, ContainerWide, LoadingPlaceholder, ViewHeader, ViewHeaderTitle } from "../../base";

import { useFetchAccount } from "../../account/querys";
import { Groups } from "../../groups/components/Groups";
import UserDetail from "../../users/components/Detail";
import { ManageUsers } from "../../users/components/Users";
import { mapSettingsStateToProps } from "../mappers";
import { AdministratorRoles } from "../types";
import { hasSufficientAdminRole } from "../utils";
import { ManageAdministrators } from "./administrators/Administrators";
import { AdministratorTabs } from "./AdministratorTabs";
import { ServerSettings } from "./Server";
export const Settings = ({ loading }) => {
    const { data: account, isLoading } = useFetchAccount();
    loading = loading || isLoading;

    const redirect = hasSufficientAdminRole(AdministratorRoles.SETTINGS, account?.administrator_role)
        ? "settings"
        : "users";

    return (
        <ContainerWide>
            <ViewHeader title="Administration">
                <ViewHeaderTitle>Administration</ViewHeaderTitle>
            </ViewHeader>

            {loading ? (
                <LoadingPlaceholder />
            ) : (
                <>
                    <AdministratorTabs administratorRole={account.administrator_role} />
                    <ContainerNarrow>
                        <Switch>
                            <Redirect from="/administration" to={`/administration/${redirect}`} exact />
                            <Route path="/administration/settings" component={ServerSettings} />
                            <Route path="/administration/users" component={ManageUsers} exact />
                            <Route path="/administration/users/:userId" component={UserDetail} />
                            <Route path="/administration/groups" component={Groups} />
                            <Route path="/administration/administrators" component={ManageAdministrators} />
                        </Switch>
                    </ContainerNarrow>
                </>
            )}
        </ContainerWide>
    );
};

export default connect(mapSettingsStateToProps)(Settings);
