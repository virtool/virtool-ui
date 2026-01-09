import { useCheckAdminRole } from "@administration/hooks";
import { AdministratorRoleName } from "@administration/types";
import { useUrlSearchParam } from "@app/hooks";
import Alert from "@base/Alert";
import InputSearch from "@base/InputSearch";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import ToggleGroup from "@base/ToggleGroup";
import ToggleGroupItem from "@base/ToggleGroupItem";
import Toolbar from "@base/Toolbar";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import CreateUser from "./CreateUser";
import UsersList from "./UsersList";

/**
 * Displays a list of editable users and tools for sorting through and creating users
 */
export function ManageUsers() {
    const [term, setTerm] = useState("");
    const { value: status, setValue: setStatus } = useUrlSearchParam<string>(
        "status",
        "active",
    );
    const { hasPermission, isPending } = useCheckAdminRole(
        AdministratorRoleName.USERS,
    );

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    if (hasPermission) {
        return (
            <>
                <Toolbar>
                    <div className="flex-grow">
                        <InputSearch
                            name="search"
                            aria-label="search"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                    </div>
                    <ToggleGroup value={status} onValueChange={setStatus}>
                        <ToggleGroupItem value="active">Active</ToggleGroupItem>
                        <ToggleGroupItem value="deactivated">
                            Deactivated
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
            <CircleAlert />
            <span>
                <strong>You do not have permission to manage users.</strong>
                <span> Contact an administrator.</span>
            </span>
        </Alert>
    );
}
