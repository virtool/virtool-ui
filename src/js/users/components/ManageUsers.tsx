import React from "react";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
import { Alert, Icon, InputSearch, LoadingPlaceholder, Toolbar } from "../../base";
import CreateUser from "./CreateUser";
import { UsersList } from "./UsersList";

/**
 * User management view. A list of editable users and tools for sorting through and creating users.
 *
 * @returns The user management view
 */
export function ManageUsers() {
    const [term, setTerm] = React.useState("");
    const { hasPermission, isLoading } = useCheckAdminRole(AdministratorRoles.USERS);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    if (hasPermission) {
        return (
            <>
                <Toolbar>
                    <InputSearch
                        name="search"
                        aria-label="search"
                        value={term}
                        onChange={e => setTerm(e.target.value)}
                    />
                    <CreateUser />
                </Toolbar>

                <UsersList term={term} />
            </>
        );
    }

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
