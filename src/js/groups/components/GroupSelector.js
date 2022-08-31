import { map, sortBy } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { BoxGroup, SelectBoxGroupSection } from "../../base";
import { getGroup } from "../actions";
import { getActiveGroup, getGroups } from "../selectors";

export const GroupsSelectBoxGroupSection = styled(SelectBoxGroupSection)`
    outline: 1px solid ${props => props.theme.color.greyLight};
    background-color: ${props => (props.active ? `${props => props.theme.color.blue}` : "white")};
    cursor: ${props => (props.selectable ? "pointer" : "default")};
    hover {
        background-color: ${props => (props.selectable ? props.theme.color.greyLightest : "white")};
    }
`;

export const GroupComponentsContainer = styled(BoxGroup)`
    height: 333px;
    background-color: ${props => props.theme.color.greyLightest};
    overflow-y: auto;
`;

export const GroupSelector = ({ activeGroupId, onChangeActiveGroup, groups }) => {
    const groupComponents = map(sortBy(groups, "id"), group => {
        return (
            <GroupsSelectBoxGroupSection
                selectable
                active={activeGroupId === group.id ? true : false}
                key={group.id}
                onClick={() => onChangeActiveGroup(group.id)}
            >
                {group.id}
            </GroupsSelectBoxGroupSection>
        );
    });

    return (
        <div>
            <label>Groups</label>
            <GroupComponentsContainer>{groupComponents}</GroupComponentsContainer>
        </div>
    );
};

const mapStateToProps = state => {
    console.log(state);
    return {
        groups: getGroups(state),
        activeGroupId: getActiveGroup(state).id
    };
};

const mapDispatchToProps = dispatch => ({
    onChangeActiveGroup: groupId => dispatch(getGroup(groupId))
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupSelector);
