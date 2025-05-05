import { map } from "lodash-es";
import React from "react";
import BoxGroup from "../../base/BoxGroup";
import BoxGroupHeader from "../../base/BoxGroupHeader";
import Checkbox from "../../base/Checkbox";
import { useUpdateGroup } from "../queries";
import { Group } from "../types";

export function GroupPermissions({ selectedGroup }: { selectedGroup: Group }) {
    const updateGroupMutator = useUpdateGroup();

    const permissionComponents = map(
        selectedGroup.permissions,
        (active, permission) => (
            <div key={permission} className="py-2 px-4">
                <Checkbox
                    checked={active}
                    id={`GroupPermissionCheckbox-${permission}`}
                    label={permission}
                    onClick={() =>
                        updateGroupMutator.mutate({
                            id: selectedGroup.id,
                            permissions: { [permission]: !active },
                        })
                    }
                />
            </div>
        ),
    );

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Permissions</h2>
            </BoxGroupHeader>
            <div className="columns-2 p-3">{permissionComponents}</div>
        </BoxGroup>
    );
}
