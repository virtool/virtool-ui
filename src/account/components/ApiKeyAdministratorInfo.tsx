import React from "react";
import { AdministratorRoles } from "../../administration/types";
import { hasSufficientAdminRole } from "../../administration/utils";
import Alert from "../../base/Alert";
import { useFetchAccount } from "../queries";

/**
 * Displays a banner with information for an admin user
 */
export default function ApiKeyAdministratorInfo() {
    const { data, isPending } = useFetchAccount();

    if (
        !isPending &&
        hasSufficientAdminRole(AdministratorRoles.BASE, data.administrator_role)
    ) {
        return (
            <Alert color="purple">
                <div>
                    <p>
                        <strong>
                            You are an administrator and can create API keys
                            with any permissions granted by that role.
                        </strong>
                    </p>
                    <p>
                        If your administrator role is reduced or removed, this
                        API key will revert to your new limited set of
                        permissions.
                    </p>
                </div>
            </Alert>
        );
    }
}
