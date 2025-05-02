import { useFetchAccount } from "@account/queries";
import { AdministratorRoles } from "@administration/types";
import {
    AdministratorPermissions,
    hasSufficientAdminRole,
} from "@administration/utils";
import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import Checkbox from "@base/Checkbox";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { Permissions } from "@groups/types";
import { map, sortBy } from "lodash-es";
import React from "react";

type APIPermissionsProps = {
    className?: string;
    keyPermissions: Permissions;
    /** Callback function to handle permission selection */
    onChange: (permissions: Permissions) => void;
};

/**
 * Manages permissions for creating/updating an API
 */
export default function ApiKeyPermissions({
    className,
    keyPermissions,
    onChange,
}: APIPermissionsProps) {
    const { data: account, isPending } = useFetchAccount();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const permissions = map(keyPermissions, (value, key) => ({
        name: key,
        allowed: value,
    }));

    const rowComponents = map(sortBy(permissions, "name"), (permission) => {
        const disabled =
            !hasSufficientAdminRole(
                AdministratorPermissions[permission.name] as AdministratorRoles,
                account.administrator_role,
            ) && !account.permissions[permission.name];

        return (
            <BoxGroupSection key={permission.name} disabled={disabled}>
                <Checkbox
                    checked={permission.allowed}
                    id={`ApiPermission-${permission.name}`}
                    label={permission.name}
                    onClick={
                        disabled
                            ? null
                            : () =>
                                  onChange({
                                      ...keyPermissions,
                                      [permission.name]: !permission.allowed,
                                  })
                    }
                />
            </BoxGroupSection>
        );
    });

    return <BoxGroup className={className}>{rowComponents}</BoxGroup>;
}
