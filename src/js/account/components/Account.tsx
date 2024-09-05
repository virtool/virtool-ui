import { ContainerNarrow, ContainerWide, Tabs, TabsLink, ViewHeader, ViewHeaderTitle } from "@base";
import React from "react";
import { Redirect, Route, Switch } from "wouter";
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
                <TabsLink to="/profile">Profile</TabsLink>
                <TabsLink to="/api">API</TabsLink>
            </Tabs>

            <ContainerNarrow>
                <Switch>
                    <Route path="/" component={() => <Redirect to="/profile" replace />} />
                    <Route path="/profile" component={AccountProfile} nest />
                    <Route path="/api" component={APIKeys} nest />
                </Switch>
            </ContainerNarrow>
        </ContainerWide>
    );
}
