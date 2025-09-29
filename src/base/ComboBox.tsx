import {
    borderRadius,
    boxShadow,
    getBorder,
    getColor,
    getFontWeight,
} from "@app/theme";
import { useCombobox } from "downshift";
import styled, { keyframes } from "styled-components";
import WrapRow from "./ComboBoxItem";
import Icon from "./Icon";
import InputSearch from "./InputSearch";

const StyledTriggerButton = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    background-color: ${({ theme }) => getColor({ color: "white", theme })};
    border: ${getBorder};
    border-radius: ${borderRadius.sm};
    font-weight: ${getFontWeight("thick")};
    text-transform: capitalize;
    width: 100%;
    i.fas {
        margin-left: 5px;
    }
`;

function ComboboxTriggerButton({
    TriggerButtonProps,
    selectedItem,
    renderRow,
    id,
}) {
    return (
        <StyledTriggerButton {...TriggerButtonProps} id={id} type="button">
            {selectedItem ? renderRow(selectedItem) : "Select user"}
            <Icon name="chevron-down" />
        </StyledTriggerButton>
    );
}

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
    border-radius: ${borderRadius.md};
    z-index: 110;
    display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const ComboBoxContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
`;

const InputSearchContainer = styled.div`
    margin: 10px 5px;
`;

function ComboBoxSearch({ getInputProps }) {
    return (
        <InputSearchContainer>
            <InputSearch {...getInputProps()} />
        </InputSearchContainer>
    );
}

type ComboBoxProps = {
    items: unknown[];
    selectedItem?: unknown;
    term: string;
    renderRow: (item: unknown) => JSX.Element;
    onFilter: (term: string) => void;
    onChange: (item: unknown) => void;
    itemToString?: (item: unknown) => string;
    id?: string;
};

function defaultToString(item: string) {
    return item;
}

export default function ComboBox({
    items,
    selectedItem,
    term,
    renderRow,
    onFilter,
    onChange,
    itemToString,
    id,
}: ComboBoxProps) {
    itemToString = itemToString || defaultToString;

    const {
        getToggleButtonProps,
        getMenuProps,
        getItemProps,
        getInputProps,
        isOpen,
    } = useCombobox({
        items,
        selectedItem,
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
            <ComboboxTriggerButton
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
}
