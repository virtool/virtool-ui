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

export const Settings = ({ loading }) => (
    <WideContainer>
        <ViewHeader title="Administration">
            <ViewHeaderTitle>Administration</ViewHeaderTitle>
        </ViewHeader>

        <Tabs bsStyle="tabs">
            <TabLink to="/administration/settings">Settings</TabLink>
            <TabLink to="/administration/users">Users</TabLink>
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
                </Switch>
            )}
        </NarrowContainer>
    </WideContainer>
);

export default connect(mapSettingsStateToProps)(Settings);
