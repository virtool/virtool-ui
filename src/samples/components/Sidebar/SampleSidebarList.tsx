import { Label } from "../../../labels/types";
import SampleLabel from "../Label/SampleLabel";
import { SubtractionOption } from "../../../subtraction/types";
import React from "react";
import styled from "styled-components";

const SampleSidebarListItem = styled(SampleLabel)`
    background-color: ${(props) => props.theme.color.white};
    display: inline;
    margin: 0 5px 5px 0;
`;

type SampleSidebarListProps = {
    /** List of labels or subtractions associated with the sample */
    items: Label[] | SubtractionOption[];
};

/**
 * A sidebar to list labels or subtractions associated with a sample
 */
export default function SampleSidebarList({ items }: SampleSidebarListProps) {
    const sampleItemComponents = items.map((item) => (
        <SampleSidebarListItem
            key={item.id}
            color={item.color}
            name={item.name}
        />
    ));

    return <div className="flex flex-wrap">{sampleItemComponents}</div>;
}
