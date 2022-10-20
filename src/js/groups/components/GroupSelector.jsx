import { map, sortBy } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getColor } from "../../app/theme";
import { BoxGroup, SelectBoxGroupSection } from "../../base";
import { getGroup } from "../actions";
import { getActiveGroup, getGroups } from "../selectors";

export const GroupsSelectBoxGroupSection = styled(SelectBoxGroupSection)`
    outline: 1px solid ${props => getColor({ color: "greyLight", theme: props.theme })};
    background-color: ${props => getColor({ color: props.active ? "blue" : "white", theme: props.theme })};
    cursor: ${props => (props.selectable ? "pointer" : "default")};
    hover {
        background-color: ${props =>
            getColor({ theme: props.theme, color: props.selectable ? "greyLightest" : "white" })};
    }
`;

export const GroupComponentsContainer = styled(BoxGroup)`
    height: "514px";
    overflow-y: auto;
    background-color: ${props => getColor({ theme: props.theme, color: "greyLightest" })};
    border-bottom: 1px solid ${props => getColor({ theme: props.theme, color: "greyLight" })};
`;

export const GroupSelector = ({ activeGroupId, onChangeActiveGroup, groups }) => {
    const groupComponents = map(sortBy(groups, "id"), group => {
        return (
            <GroupsSelectBoxGroupSection
                selectable
                active={activeGroupId === group.id}
                key={group.id}
                onClick={() => onChangeActiveGroup(group.id)}
            >
                {group.id}
            </GroupsSelectBoxGroupSection>
        );
    });

    return <GroupComponentsContainer>{groupComponents}</GroupComponentsContainer>;
};

const mapStateToProps = state => {
    return {
        groups: getGroups(state),
        activeGroupId: getActiveGroup(state).id
    };
};

const mapDispatchToProps = dispatch => ({
    onChangeActiveGroup: groupId => dispatch(getGroup(groupId))
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupSelector);
