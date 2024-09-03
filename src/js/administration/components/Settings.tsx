import { useFetchAccount } from "@account/queries";
import { ContainerNarrow, ContainerWide, LoadingPlaceholder, ViewHeader, ViewHeaderTitle } from "@base";
import { ManageUsers } from "@users/components/ManageUsers";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom-v5-compat";
import Groups from "../../groups/components/Groups";
import UserDetail from "../../users/components/UserDetail";
import { AdministratorRoles } from "../types";
import { hasSufficientAdminRole } from "../utils";
import { ManageAdministrators } from "./administrators/Administrators";
import { AdministratorTabs } from "./AdministratorTabs";
import { ServerSettings } from "./ServerSettings";

export default function Settings() {
    const { data: account, isPending } = useFetchAccount();

    const redirect = hasSufficientAdminRole(AdministratorRoles.SETTINGS, account?.administrator_role)
        ? "settings"
        : "users";

    return (
        <ContainerWide>
            <ViewHeader title="Administration">
                <ViewHeaderTitle>Administration</ViewHeaderTitle>
            </ViewHeader>

            {isPending ? (
                <LoadingPlaceholder />
            ) : (
                <>
                    <AdministratorTabs administratorRole={account.administrator_role} />
                    <ContainerNarrow>
                        <Routes>
                            <Route path="/" element={<Navigate to={`${redirect}`} replace />} />
                            <Route path="/settings" element={<ServerSettings />} />
                            <Route path="/users" element={<ManageUsers />} />
                            <Route path="/users/:userId" element={<UserDetail />} />
                            <Route path="/groups" element={<Groups />} />
                            <Route path="/administrators" element={<ManageAdministrators />} />
                        </Routes>
                    </ContainerNarrow>
                </>
            )}
        </ContainerWide>
    );
}
