import React from "react";
import styled from "styled-components";
import { sortBy, map } from "lodash-es";
import { SelectBoxGroupSection, BoxGroup } from "../../base";

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

export const SelectedGroup = ({ activeId, onChangeActiveGroup, groupsList }) => {
    const groupComponents = map(sortBy(groupsList, "id"), group => {
        return (
            <GroupsSelectBoxGroupSection
                selectable
                active={activeId === group.id ? true : false}
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
