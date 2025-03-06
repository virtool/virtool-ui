import { BoxGroup, SelectBoxGroupSection } from "@/base";
import { getColor } from "@app/theme";
import { map, sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { GroupMinimal } from "../types";

type GroupsSelectBoxGroupSectionProps = {
    selectable?: boolean;
};

export const GroupsSelectBoxGroupSection = styled(
    SelectBoxGroupSection,
)<GroupsSelectBoxGroupSectionProps>`
    outline: 1px solid
        ${(props) => getColor({ color: "greyLight", theme: props.theme })};
    background-color: ${(props) =>
        getColor({
            color: props.active ? "blue" : "white",
            theme: props.theme,
        })};
    cursor: ${(props) => (props.selectable ? "pointer" : "default")};
    &:hover {
        background-color: ${(props) =>
            getColor({
                theme: props.theme,
                color: props.selectable ? "greyLightest" : "white",
            })};
    }
`;

export const GroupComponentsContainer = styled(BoxGroup)`
    height: 514px;
    overflow-y: auto;
    background-color: ${(props) =>
        getColor({ theme: props.theme, color: "greyLightest" })};
    border-bottom: 1px solid
        ${(props) => getColor({ theme: props.theme, color: "greyLight" })};
`;

type GroupSelectorProps = {
    selectedGroup?: string;
    setSelectedGroup: (string) => void;
    groups: Array<GroupMinimal>;
};

export const GroupSelector = ({
    selectedGroup,
    setSelectedGroup,
    groups,
}: GroupSelectorProps) => {
    const groupComponents = map(sortBy(groups, "name"), (group) => {
        return (
            <GroupsSelectBoxGroupSection
                selectable
                active={selectedGroup === group.id}
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
            >
                {group.name}
            </GroupsSelectBoxGroupSection>
        );
    });

    return (
        <GroupComponentsContainer>{groupComponents}</GroupComponentsContainer>
    );
};
