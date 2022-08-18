import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fontWeight, getFontSize } from "../../../app/theme";
import { Icon, SidebarHeaderButton } from "../../../base";
import { BoxGroupSearch } from "../../../base/BoxGroupSearch";
import { useFuse } from "../../../base/hooks";
import { PopoverBody, usePopover } from "../../../base/Popover";
import { SampleSidebarSelectorItem } from "./SelectorItem";

const SampleSidebarSelectorButton = styled.div`
    display: flex;
    border-top: 1px solid;
    border-color: ${props => props.theme.color.greyLight};
    width: 100%;
    display: flex;
    align-items: right;

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

export const SampleSidebarSelector = ({
    render,
    sampleItems,
    selectedItems,
    partiallySelectedItems = [],
    sampleId,
    onUpdate,
    selectionType,
    manageLink
}) => {
    const [results, term, setTerm] = useFuse(sampleItems, ["name"], [sampleId]);
    const [attributes, show, styles, setPopperElement, setReferenceElement, setShow] = usePopover();
    const sampleItemComponents = results.map(item => {
        const result = item.id ? item : item.item;
        return (
            <SampleSidebarSelectorItem
                key={result.id}
                selected={selectedItems.includes(result.id)}
                partiallySelected={partiallySelectedItems.includes(result.id)}
                {...result}
                onClick={onUpdate}
            >
                {render(result)}
            </SampleSidebarSelectorItem>
        );
    });

    return (
        <>
            {!sampleItems.length || (
                <SidebarHeaderButton
                    aria-label={`select ${selectionType}`}
                    type="button"
                    ref={setReferenceElement}
                    onClick={setShow}
                >
                    <Icon name="pen" />
                </SidebarHeaderButton>
            )}
            {show && (
                <PopoverBody ref={setPopperElement} show={show} style={styles.popper} {...attributes.popper}>
                    <BoxGroupSearch placeholder="Filter items" label="Filter items" value={term} onChange={setTerm} />
                    <SampleItemComponentsContainer>{sampleItemComponents}</SampleItemComponentsContainer>
                    <SampleSidebarSelectorButton>
                        <Link to={manageLink}> Manage</Link>
                    </SampleSidebarSelectorButton>
                </PopoverBody>
            )}
        </>
    );
};
