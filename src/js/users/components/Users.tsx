import React from "react";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
import { Alert, Icon, InputSearch, LinkButton, LoadingPlaceholder, Toolbar } from "../../base";
import CreateUser from "./Create";
import { UsersList } from "./List";

export function ManageUsers() {
    const [term, setTerm] = React.useState("");
    const { hasPermission, isLoading }: { hasPermission: boolean; isLoading: boolean } = useCheckAdminRole(
        AdministratorRoles.USERS,
    );

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    if (!hasPermission) {
        return (
            <Alert color="orange" level>
                <Icon name="exclamation-circle" />
                <span>
                    <strong>You do not have permission to manage users.</strong>
                    <span> Contact an administrator.</span>
                </span>
            </Alert>
        );
    }

    return (
        <>
            <Toolbar>
                <InputSearch name="search" aria-label="search" value={term} onChange={e => setTerm(e.target.value)} />
                <LinkButton to={{ state: { createUser: true } }} icon="user-plus" tip="Create User" color="blue" />
            </Toolbar>

            <UsersList term={term} />

            <CreateUser />
        </>
    );
}
