import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { ContainerNarrow, ContainerWide, Tabs, TabsLink, ViewHeader, ViewHeaderTitle } from "@base";
import AccountProfile from "./AccountProfile";
import APIKeys from "./API/APIKeys";

/**
 * Displays the account page containing the profile and API subpages.
 */
export default function Account() {
    return (
        <ContainerWide>
            <ViewHeader title="Account">
                <ViewHeaderTitle>Account</ViewHeaderTitle>
            </ViewHeader>

            <Tabs>
                <TabsLink to="/account/profile">Profile</TabsLink>
                <TabsLink to="/account/api">API</TabsLink>
            </Tabs>

            <ContainerNarrow>
                <Switch>
                    <Redirect from="/account" to="/account/profile" exact />
                    <Route path="/account/profile" component={AccountProfile} />
                    <Route path="/account/api" component={APIKeys} />
                </Switch>
            </ContainerNarrow>
        </ContainerWide>
    );
}
