import React from "react";
import { map, filter, some } from "lodash-es";
import { GroupsSelectBoxGroupSection, GroupComponentsContainer } from "./SelectedGroup";

export const SelectedGroupMembers = ({ users, activeId }) => {
    const groupMembers = users ? filter(users, user => some(user.groups, { id: activeId })) : null;
    const memberComponents = map(groupMembers, member => (
        <GroupsSelectBoxGroupSection key={member.id}>{member.handle}</GroupsSelectBoxGroupSection>
    ));

    return (
        <div>
            <label>Group members</label>
            <GroupComponentsContainer>{memberComponents}</GroupComponentsContainer>
        </div>
    );
};
