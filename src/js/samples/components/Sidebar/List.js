import React from "react";
import styled from "styled-components";
import { SampleLabel, SampleMultiSelectLabel } from "../Label";
import { map } from "lodash-es";

const SampleSidebarListItem = styled(SampleLabel)`
    background-color: ${props => props.theme.color.white};
    display: inline;
    margin: 0 5px 5px 0;
`;

const StyledSampleSidebarList = styled.div`
    display: flex;
    flex-flow: wrap;
`;

export const SampleSidebarList = ({ items }) => {
    const sampleItemComponents = items.map(item => (
        <SampleSidebarListItem key={item.id} color={item.color} name={item.name} />
    ));

    return <StyledSampleSidebarList>{sampleItemComponents}</StyledSampleSidebarList>;
};

const SampleSidebarMultiSelectListItem = styled(SampleMultiSelectLabel)`
    background-color: ${props => props.theme.color.white};
    display: inline;
    margin: 4px 0px;
    :not(:last-child) {
        margin-right: 8px;
    }
`;

export const SampleSidebarMultiselectList = ({ items }) => {
    const sampleItemComponents = map(items, ({ id, color, name, allLabeled }) => (
        <SampleSidebarMultiSelectListItem key={id} color={color} name={name} partiallySelected={!allLabeled} />
    ));

    return <StyledSampleSidebarList>{sampleItemComponents}</StyledSampleSidebarList>;
};
