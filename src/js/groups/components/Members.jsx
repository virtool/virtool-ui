import { filter, map, some } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { getUsers } from "../../users/selectors";
import { getActiveGroup } from "../selectors";
import { NoneSelected } from "./Groups";
import { GroupsSelectBoxGroupSection } from "./GroupSelector";
import { InitialIcon, BoxGroup } from "../../base";
import styled from "styled-components";
import { getColor } from "../../app/theme";

const GroupMemberContainer = styled.div`
    display: flex;
    svg {
        margin-right: 15px;
    }
`;

export const GroupsHeaderContainer = styled(BoxGroup)`
    background-color: ${props => getColor({ theme: props.theme, color: "greyLightest" })};
    height: 50px;
    border: none;
    border-bottom: 1px solid ${props => getColor({ theme: props.theme, color: "greyLight" })};
    margin-bottom: 0;
    h4 {
        position: absolute;
        margin-left: 18px;
    }
`;

export const GroupsInfoBoxGroupSection = styled(BoxGroup)`
    height: 250px;
    background-color: white;
    border-bottom: none;
`;

export const SelectedGroupInfoContainer = styled(BoxGroup)`
    height: 200px;
    overflow-y: auto;
    border: none;
    border-top-left-radius: 0px;
    border-bottom: 1px solid ${props => getColor({ theme: props.theme, color: "greyLight" })};
`;

export const Members = ({ users, activeGroupId }) => {
    const activeGroupMembers = filter(users, user => some(user.groups, { id: activeGroupId }));
    const memberComponents = map(activeGroupMembers, member => (
        <GroupsSelectBoxGroupSection key={member.id}>
            <GroupMemberContainer>
                <InitialIcon handle={member.handle} size="md" />
                {member.handle}
            </GroupMemberContainer>
        </GroupsSelectBoxGroupSection>
    ));
    return (
        <GroupsInfoBoxGroupSection>
            <GroupsHeaderContainer>
                <h4>Members</h4>
            </GroupsHeaderContainer>
            <SelectedGroupInfoContainer>
                {memberComponents}
                {Boolean(memberComponents.length) || <NoneSelected>No Group Members</NoneSelected>}
            </SelectedGroupInfoContainer>
        </GroupsInfoBoxGroupSection>
    );
};

const mapStateToProps = state => ({
    users: getUsers(state),
    activeGroupId: getActiveGroup(state).id
});

export default connect(mapStateToProps)(Members);
