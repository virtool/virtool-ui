import { filter, map, some } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { getUsers } from "../../users/selectors";
import { getActiveGroup } from "../selectors";
import { NoneSelected } from "./Groups";
import { GroupComponentsContainer, GroupsSelectBoxGroupSection } from "./GroupSelector";

export const Members = ({ users, activeGroupId }) => {
    const activeGroupMembers = filter(users, user => some(user.groups, { id: activeGroupId }));
    const memberComponents = map(activeGroupMembers, member => (
        <GroupsSelectBoxGroupSection key={member.id}>{member.handle}</GroupsSelectBoxGroupSection>
    ));
    return (
        <div>
            <label>Group members</label>
            <GroupComponentsContainer>
                {memberComponents}
                {Boolean(memberComponents.length) || <NoneSelected>No Group Members</NoneSelected>}
            </GroupComponentsContainer>
        </div>
    );
};

const mapStateToProps = state => ({
    users: getUsers(state),
    activeGroupId: getActiveGroup(state).id
});

export default connect(mapStateToProps)(Members);
