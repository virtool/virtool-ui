import { useCombobox } from "downshift";
import React from "react";
import styled, { keyframes } from "styled-components";
import { borderRadius, boxShadow, getBorder } from "../../app/theme";
import { WrapRow } from "./Item";
import { ComboBoxSearch } from "./Search";
import { TriggerButton } from "./Trigger";

const ComboBoxContentOpen = keyframes`  
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

interface Content {
    $isOpen: boolean;
}

const Content = styled.ul<Content>`
    transform-origin: top center;
    animation: ${ComboBoxContentOpen} 150ms cubic-bezier(0.16, 1, 0.3, 1);
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

            <Content {...getMenuProps()} $isOpen={isOpen}>
                <ComboBoxSearch getInputProps={getInputProps} />
                {isOpen && rows}
            </Content>
        </ComboBoxContainer>
    );
};
