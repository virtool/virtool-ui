import { useCheckAdminRole } from "@administration/hooks";
import { AdministratorRoles } from "@administration/types";
import { Alert, Icon, InputSearch, LoadingPlaceholder, Toolbar } from "@base";
import { ToggleGroup } from "@base/ToggleGroup";
import { ToggleGroupItem } from "@base/ToggleGroupItem";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import CreateUser from "./CreateUser";
import { UsersList } from "./UsersList";

/**
 * Displays a list of editable users and tools for sorting through and creating users
 */
export function ManageUsers() {
    const [term, setTerm] = React.useState("");
    const [active, setActive] = useUrlSearchParams<boolean>("active", true);
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
                    <ToggleGroup type="single" defaultValue={active ? "active" : "inactive"}>
                        <ToggleGroupItem value="active" onClick={() => setActive(true)}>
                            Active
                        </ToggleGroupItem>
                        <ToggleGroupItem value="inactive" onClick={() => setActive(false)}>
                            Inactive
                        </ToggleGroupItem>
                    </ToggleGroup>
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
