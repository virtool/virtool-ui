import React from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import {
    ContainerNarrow,
    ContainerWide,
    LoadingPlaceholder,
    Tabs,
    TabsLink,
    ViewHeader,
    ViewHeaderTitle
} from "../../base";

import UserDetail from "../../users/components/Detail";
import Users from "../../users/components/Users";
import { mapSettingsStateToProps } from "../mappers";
import { ServerSettings } from "./Server";
import Groups from "../../groups/components/Groups";

export const Settings = ({ loading }) => (
    <ContainerWide>
        <ViewHeader title="Administration">
            <ViewHeaderTitle>Administration</ViewHeaderTitle>
        </ViewHeader>

        <Tabs bsStyle="tabs">
            <TabsLink to="/administration/settings">Settings</TabsLink>
            <TabsLink to="/administration/users">Users</TabsLink>
            <TabsLink to="/administration/groups">Groups</TabsLink>
        </Tabs>

        <ContainerNarrow>
            {loading ? (
                <LoadingPlaceholder />
            ) : (
                <Switch>
                    <Redirect from="/administration" to="/administration/settings" exact />
                    <Route path="/administration/settings" component={ServerSettings} />
                    <Route path="/administration/users" component={Users} exact />
                    <Route path="/administration/users/:userId" component={UserDetail} />
                    <Route path="/administration/groups" component={Groups} />
                </Switch>
            )}
        </ContainerNarrow>
    </ContainerWide>
);

export default connect(mapSettingsStateToProps)(Settings);
