import { BoxGroup } from "@/base";
import { Permissions } from "@groups/types";
import { transform } from "lodash-es";
import React from "react";
import { PermissionItem } from "./Permission";

type UserPermissionsProps = {
    /** The users permissions */
    permissions: Permissions;
};

/**
 * A view of the users permissions
 */
export default function UserPermissions({ permissions }: UserPermissionsProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Permissions</span>
                <small className="font-medium text-gray-500">
                    Change group membership to modify permissions
                </small>
            </div>
            <BoxGroup>
                {transform(
                    permissions,
                    (acc, value, permission) =>
                        acc.push(
                            <PermissionItem
                                key={permission}
                                permission={permission}
                                value={value}
                            />,
                        ),
                    [],
                )}
            </BoxGroup>
        </div>
    );
}
