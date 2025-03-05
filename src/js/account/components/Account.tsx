import {
    ContainerNarrow,
    ContainerWide,
    Tabs,
    TabsLink,
    ViewHeader,
    ViewHeaderTitle,
} from "@base";
import React from "react";
import { Redirect, Route, Switch } from "wouter";
import APIKeys from "./API/APIKeys";
import AccountProfile from "./AccountProfile";

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
                    <Route
                        path="/account"
                        component={() => (
                            <Redirect to="/account/profile" replace />
                        )}
                    />
                    <Route path="/account/profile" component={AccountProfile} />
                    <Route path="/account/api" component={APIKeys} />
                </Switch>
            </ContainerNarrow>
        </ContainerWide>
    );
}
