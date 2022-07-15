import React from "react";
import { map, find } from "lodash-es";
import { GroupPermission } from "../../groups/components/Permission";
import { GroupComponentsContainer } from "./SelectedGroup";

export const SelectedPermissions = ({ activeId, groupsList, onSetPermission }) => {
    const selectedGroup = find(groupsList, { id: activeId });

    const permissionComponents = map(selectedGroup.permissions, (active, permission) => (
        <GroupPermission
            key={permission}
            active={active}
            permission={permission}
            onClick={() => onSetPermission(selectedGroup.id, permission, !active)}
        />
    ));

    return (
        <div>
            <label>Permissions</label>
            <GroupComponentsContainer>{permissionComponents}</GroupComponentsContainer>
        </div>
    );
};
