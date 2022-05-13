import React from "react";
import styled from "styled-components";
import { BoxGroupSection, Icon, Input, SidebarHeaderButton } from "../../../base";
import { useFuse } from "../../../base/hooks";
import { PopoverBody, usePopover } from "../../../base/Popover";
import { SampleSidebarSelectorItem } from "./SelectorItem";
import { Link } from "react-router-dom";
import { getFontSize, fontWeight } from "../../../app/theme";

const SampleSidebarSelectorInputContainer = styled(BoxGroupSection)`
    padding: 10px;
`;

const SampleSidebarSelectorButton = styled.div`
    display: flex;

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
    const sampleItemComponents = results.map(item => (
        <SampleSidebarSelectorItem
            key={item.id}
            selected={selectedItems.includes(item.id)}
            partiallySelected={partiallySelectedItems.includes(item.id)}
            {...item}
            onClick={onUpdate}
        >
            {render(item)}
        </SampleSidebarSelectorItem>
    ));

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
                    <SampleSidebarSelectorInputContainer>
                        <Input
                            value={term}
                            placeholder="Filter items"
                            aria-label="Filter items"
                            onChange={e => setTerm(e.target.value)}
                            autoFocus
                        />
                    </SampleSidebarSelectorInputContainer>
                    <SampleItemComponentsContainer>
                        {sampleItemComponents}
                        <SampleSidebarSelectorButton>
                            <Link to={manageLink}> Manage</Link>
                        </SampleSidebarSelectorButton>
                    </SampleItemComponentsContainer>
                </PopoverBody>
            )}
        </>
    );
};
