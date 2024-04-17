import { SampleLabel } from "@samples/queries";
import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { SampleMultiSelectLabel } from "../Label/SampleMultiSelectLabel";

const StyledSampleSidebarList = styled.div`
    display: flex;
    flex-flow: wrap;
`;

const SampleSidebarMultiSelectListItem = styled(SampleMultiSelectLabel)`
    background-color: ${props => props.theme.color.white};
    display: inline;
    margin: 4px 0;

    &:not(:last-child) {
        margin-right: 8px;
    }
`;

type SampleSidebarMultiselectList = {
    /** List of labels that can be used to filter samples */
    items: SampleLabel[];
};

/**
 * Displays a list of labels to filter samples by
 */
export default function SampleSidebarMultiselectList({ items }: SampleSidebarMultiselectList) {
    const sampleItemComponents = map(items, ({ id, color, name, allLabeled }) => (
        <SampleSidebarMultiSelectListItem key={id} color={color} name={name} partiallySelected={!allLabeled} />
    ));

    return <StyledSampleSidebarList>{sampleItemComponents}</StyledSampleSidebarList>;
}
