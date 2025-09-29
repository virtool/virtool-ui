import ContainerNarrow from "@base/ContainerNarrow";
import ContainerWide from "@base/ContainerWide";
import Tabs from "@base/Tabs";
import TabsLink from "@base/TabsLink";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { Redirect, Route, Switch } from "wouter";
import AccountProfile from "./AccountProfile";
import ApiKeys from "./ApiKeys";

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
                    <Route path="/account/api" component={ApiKeys} />
                </Switch>
            </ContainerNarrow>
        </ContainerWide>
    );
}
