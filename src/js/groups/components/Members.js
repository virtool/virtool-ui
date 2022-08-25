import React from "react";
import { map, filter, some } from "lodash-es";
import { GroupsSelectBoxGroupSection, GroupComponentsContainer } from "./GroupSelector";
import { NoneSelected } from "./Groups";

export const Members = ({ users, activeId }) => {
    const groupMembers = users ? filter(users, user => some(user.groups, { id: activeId })) : null;
    const memberComponents = groupMembers.length ? (
        map(groupMembers, member => (
            <GroupsSelectBoxGroupSection key={member.id}>{member.handle}</GroupsSelectBoxGroupSection>
        ))
    ) : (
        <NoneSelected>No Group Members</NoneSelected>
    );

    return (
        <div>
            <label>Group members</label>
            <GroupComponentsContainer>{memberComponents}</GroupComponentsContainer>
        </div>
    );
};
