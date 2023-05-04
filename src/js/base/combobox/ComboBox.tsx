import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useCombobox } from "downshift";
import React from "react";
import styled, { keyframes } from "styled-components";
import { borderRadius, boxShadow, getBorder, getColor, getFontWeight } from "../../app/theme";
import { Icon } from "../Icon";
import { InputSearch } from "../InputSearch";

const ComboBoxItem = styled.li`
    padding: 10px 10px;

    :hover {
        background-color: ${({ theme }) => getColor({ color: "greyHover", theme })};
        border: 0;
    }
`;
const WrapRow = (renderRow, getItemProps) => (item, index) => {
    return (
        <ComboBoxItem
            key={item.id}
            {...getItemProps({
                item: item.id,
                index,
            })}
        >
            {renderRow(item)}
        </ComboBoxItem>
    );
};

const dialogOverlayOpen = keyframes`  
    from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const DialogOverlay = styled(DialogPrimitive.Overlay)`
    animation: ${dialogOverlayOpen} 150ms cubic-bezier(0.16, 1, 0.3, 1);
    background-color: rgba(107, 114, 128, 0.6);
    inset: 0;
    position: fixed;
    z-index: 110;
`;

interface ComboBoxPopdownProps {
    $isOpen: boolean;
}

const ComboBoxPopdown = styled.ul<ComboBoxPopdownProps>`
    top: 100%;
    padding: 0;
    margin-top: 0;
    position: absolute;
    background-color: white;
    width: 100%;
    max-height: 20rem;
    overflow-y: auto;
    overflow-x: hidden;
    outline: 0;
    transition: opacity 0.1s ease;
    box-shadow: ${boxShadow.md};
    border: ${getBorder};
    border-radius: ${borderRadius["md"]};
    box-shadow: ${boxShadow["md"]};
    z-index: 110;
    display: ${props => (props.$isOpen ? "block" : "none")};
`;

const InputSearchContainer = styled.div`
    margin: 10px 5px;
`;

const ComboBoxContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
`;

type ComboBoxProps = {
    items: any[];
    selectedItem?: any;
    term: string;
    renderRow: (item: any) => JSX.Element;
    onFilter: (term: string) => void;
    onChange: (item: any) => void;
    itemToString?: (item: any) => string;
    id?: string;
};

const defaultToString = (item: any) => item;
export const ComboBox = ({
    items,
    selectedItem,
    term,
    renderRow,
    onFilter,
    onChange,
    itemToString,
    id,
}: ComboBoxProps) => {
    itemToString = itemToString || defaultToString;

    const { getToggleButtonProps, getMenuProps, getItemProps, getInputProps, isOpen } = useCombobox({
        items,
        selectedItem: selectedItem,
        inputValue: term,
        onInputValueChange: ({ inputValue }) => {
            onFilter(inputValue);
        },
        onSelectedItemChange: ({ selectedItem }) => {
            onChange(selectedItem);
        },
        itemToString,
    });

    const rows = items.map(WrapRow(renderRow, getItemProps));

    return (
        <ComboBoxContainer>
            <TriggerButton
                TriggerButtonProps={getToggleButtonProps()}
                selectedItem={selectedItem}
                renderRow={renderRow}
                id={id}
            />

            <ComboBoxPopdown {...getMenuProps()} $isOpen={isOpen}>
                <InputSearchContainer>
                    <InputSearch {...getInputProps()} />
                </InputSearchContainer>
                {isOpen && rows}
            </ComboBoxPopdown>
        </ComboBoxContainer>
    );
};

const StyledTriggerButton = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    background-color: ${({ theme }) => getColor({ color: "white", theme })};
    border: ${getBorder};
    border-radius: ${borderRadius["sm"]};
    font-weight: ${getFontWeight("thick")};
    text-transform: capitalize;
    width: 100%;
    i.fas {
        margin-left: 5px;
    }
`;
const TriggerButton = ({ TriggerButtonProps, selectedItem, renderRow, id }) => {
    return (
        <StyledTriggerButton {...TriggerButtonProps} id={id} type="button">
            {selectedItem ? renderRow(selectedItem) : "Select user"}
            <Icon name="chevron-down" />
        </StyledTriggerButton>
    );
};
