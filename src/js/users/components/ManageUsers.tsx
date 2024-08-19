import { useCheckAdminRole } from "@administration/hooks";
import { AdministratorRoles } from "@administration/types";
import { Alert, Icon, InputSearch, LoadingPlaceholder } from "@base";
import { ToggleGroup } from "@base/ToggleGroup";
import { ToggleGroupItem } from "@base/ToggleGroupItem";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import CreateUser from "./CreateUser";
import { UsersList } from "./UsersList";

type UserStatus = "active" | "deactivated";

/**
 * Displays a list of editable users and tools for sorting through and creating users
 */
export function ManageUsers() {
    const [term, setTerm] = React.useState("");
    const [status, setStatus] = useUrlSearchParams<UserStatus>("status", "active");
    const { hasPermission, isPending } = useCheckAdminRole(AdministratorRoles.USERS);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    if (hasPermission) {
        return (
            <>
                <div className="flex gap-2 mb-3">
                    <div className="flex-grow">
                        <InputSearch
                            name="search"
                            aria-label="search"
                            value={term}
                            onChange={e => setTerm(e.target.value)}
                        />
                    </div>
                    <ToggleGroup value={status} onValueChange={setStatus}>
                        <ToggleGroupItem value="active">Active</ToggleGroupItem>
                        <ToggleGroupItem value="deactivated">Deactivated</ToggleGroupItem>
                    </ToggleGroup>
                    <CreateUser />
                </div>

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
