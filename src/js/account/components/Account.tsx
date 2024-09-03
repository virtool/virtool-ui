import { ContainerNarrow, ContainerWide, Tabs, TabsLink, ViewHeader, ViewHeaderTitle } from "@base";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom-v5-compat";
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
                <Routes>
                    <Route path="" element={<Navigate to="/account/profile" replace />} />
                    <Route path="/account/profile" element={<AccountProfile />} />
                    <Route path="/account/api" element={<APIKeys />} />
                </Routes>
            </ContainerNarrow>
        </ContainerWide>
    );
}
