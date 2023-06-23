import { map } from "lodash-es";
import React from "react";
import { useSetPermission } from "../querys";
import { Group } from "../types";
import { GroupsHeaderContainer, GroupsInfoBoxGroupSection, SelectedGroupInfoContainer } from "./Members";
import { GroupPermission } from "./Permission";

export const Permissions = ({ selectedGroup }: { selectedGroup: Group }) => {
    const setPermissionMutator = useSetPermission();

    const permissionComponents = map(selectedGroup.permissions, (active, permission) => (
        <GroupPermission
            key={permission}
            active={active}
            permission={permission}
            onClick={() => setPermissionMutator.mutate({ id: selectedGroup.id, permission, value: !active })}
        />
    ));

    return (
        <GroupsInfoBoxGroupSection>
            <GroupsHeaderContainer>
                <h4>Permissions</h4>
            </GroupsHeaderContainer>
            <SelectedGroupInfoContainer>{permissionComponents}</SelectedGroupInfoContainer>
        </GroupsInfoBoxGroupSection>
    );
};
