import React from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import {
    LoadingPlaceholder,
    NarrowContainer,
    TabLink,
    Tabs,
    ViewHeader,
    ViewHeaderTitle,
    WideContainer
} from "../../base";

import UserDetail from "../../users/components/Detail";
import Users from "../../users/components/Users";
import { mapSettingsStateToProps } from "../mappers";
import { ServerSettings } from "./Server";
import Groups from "../../groups/components/Groups";

export const Settings = ({ loading }) => (
    <WideContainer>
        <ViewHeader title="Administration">
            <ViewHeaderTitle>Administration</ViewHeaderTitle>
        </ViewHeader>

        <Tabs bsStyle="tabs">
            <TabLink to="/administration/settings">Settings</TabLink>
            <TabLink to="/administration/users">Users</TabLink>
            <TabLink to="/administration/groups">Groups</TabLink>
        </Tabs>

        <NarrowContainer>
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
        </NarrowContainer>
    </WideContainer>
);

export default connect(mapSettingsStateToProps)(Settings);
