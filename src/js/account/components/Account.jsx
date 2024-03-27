import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import { ContainerNarrow, ContainerWide, Tabs, TabsLink, ViewHeader, ViewHeaderTitle } from "@base";
import { getAccount } from "../actions";
import { getAccountId } from "../selectors";
import AccountProfile from "./AccountProfile";
import APIKeys from "./API/API";

function Account({ userId, onGet }) {
    useEffect(() => onGet(), [userId]);

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

function mapStateToProps(state) {
    return {
        userId: getAccountId(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onGet: () => {
            dispatch(getAccount());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
