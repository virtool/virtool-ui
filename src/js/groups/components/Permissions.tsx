import { map } from "lodash-es";
import React from "react";
import { useUpdateGroup } from "../queries";
import { Group } from "../types";
import { GroupsHeaderContainer, GroupsInfoBoxGroupSection, SelectedGroupInfoContainer } from "./Members";
import { GroupPermission } from "./Permission";

export const Permissions = ({ selectedGroup }: { selectedGroup: Group }) => {
    const updateGroupMutator = useUpdateGroup();

    const permissionComponents = map(selectedGroup.permissions, (active, permission) => (
        <GroupPermission
            key={permission}
            active={active}
            permission={permission}
            onClick={() => updateGroupMutator.mutate({ id: selectedGroup.id, permissions: { [permission]: !active } })}
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
