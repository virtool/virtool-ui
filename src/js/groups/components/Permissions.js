import React from "react";
import { map, find } from "lodash-es";
import { GroupPermission } from "./Permission";
import { GroupComponentsContainer } from "./GroupSelector";

export const Permissions = ({ activeId, groupsList, onSetPermission }) => {
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
