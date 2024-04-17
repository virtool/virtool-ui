import { fontWeight, getFontSize } from "@app/theme";
import { BoxGroupSearch, Icon, SidebarHeaderButton } from "@base";
import { useFuse } from "@base/hooks";
import { Popover } from "@base/Popover";
import { Label } from "@labels/types";
import { SubtractionShortlist } from "@subtraction/types";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { SampleSidebarSelectorItem } from "./SampleSidebarSelectorItem";

const SampleSidebarSelectorButton = styled.div`
    display: flex;
    border-top: 1px solid;
    border-color: ${props => props.theme.color.greyLight};
    width: 100%;
    align-items: flex-end;

    a {
        margin-left: auto;
        font-size: ${getFontSize("md")};
        font-weight: ${fontWeight.thick};
        padding: 10px 10px 10px 0px;
    }
`;

const SampleItemComponentsContainer = styled.div`
    max-height: 300px;
    overflow-y: scroll;
`;

type SampleSidebarSelectorProps = {
    /** The link to manage labels or subtractions */
    manageLink: string;
    /** A callback function to handle sidebar item selection */
    onUpdate: (id: string | number) => void;
    /** List of label ids applied to some, but not all selected samples */
    partiallySelectedItems?: number[];
    /** The styled component for the list items */
    render: (result: { color?: string; description?: string; name: string }) => React.ReactNode;
    /** A list of labels or default subtractions */
    sampleItems: Label[] | SubtractionShortlist[];
    /** A list of selected items by their ids */
    selectedItems: string[] | number[];
    /** Whether the sidebar is labels or subtractions */
    selectionType: string;
};

/**
 * Displays a dropdown list of labels or subtractions
 */
export function SampleSidebarSelector({
    render,
    sampleItems,
    selectedItems,
    partiallySelectedItems = [],
    onUpdate,
    selectionType,
    manageLink,
}: SampleSidebarSelectorProps) {
    const [results, term, setTerm] = useFuse(sampleItems, ["name"], []);
    const sampleItemComponents = results.map((item: Label | SubtractionShortlist) => {
        const { id } = item;

        return (
            <SampleSidebarSelectorItem
                key={item.id}
                selected={selectedItems.includes(id as never)}
                partiallySelected={partiallySelectedItems.includes(item.id as number)}
                {...item}
                onClick={onUpdate}
            >
                {render(item)}
            </SampleSidebarSelectorItem>
        );
    });

    return (
        <Popover
            trigger={
                !sampleItems.length || (
                    <SidebarHeaderButton aria-label={`select ${selectionType}`} type="button">
                        <Icon name="pen" />
                    </SidebarHeaderButton>
                )
            }
        >
            <BoxGroupSearch placeholder="Filter items" label="Filter items" value={term} onChange={setTerm} />
            <SampleItemComponentsContainer>{sampleItemComponents}</SampleItemComponentsContainer>
            <SampleSidebarSelectorButton>
                <Link to={manageLink}> Manage</Link>
            </SampleSidebarSelectorButton>
        </Popover>
    );
}
