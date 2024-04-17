import { Label } from "@labels/types";
import { SampleLabel } from "@samples/components/Label/SampleLabel";
import { SubtractionShortlist } from "@subtraction/types";
import React from "react";
import styled from "styled-components";

const SampleSidebarListItem = styled(SampleLabel)`
    background-color: ${props => props.theme.color.white};
    display: inline;
    margin: 0 5px 5px 0;
`;

const StyledSampleSidebarList = styled.div`
    display: flex;
    flex-flow: wrap;
`;

type SampleSidebarListProps = {
    /** List of labels or subtractions associated with the sample */
    items: Label[] | SubtractionShortlist[];
};

/**
 * A sidebar to list labels or subtractions associated with a sample
 */
export default function SampleSidebarList({ items }: SampleSidebarListProps) {
    const sampleItemComponents = items.map(item => (
        <SampleSidebarListItem key={item.id} color={item.color} name={item.name} />
    ));

    return <StyledSampleSidebarList>{sampleItemComponents}</StyledSampleSidebarList>;
}
