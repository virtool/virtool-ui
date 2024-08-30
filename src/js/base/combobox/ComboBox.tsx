import { Icon } from "@/base";
import { borderRadius, boxShadow, getBorder } from "@app/theme";
import { Command } from "@base/command/Command";
import { CommandEmpty } from "@base/command/CommandEmpty";
import { CommandGroup } from "@base/command/CommandGroup";
import { CommandInput } from "@base/command/CommandInput";
import { CommandItem } from "@base/command/CommandItem";
import { CommandList } from "@base/command/CommandList";
import { Popover } from "@base/Popover";
import { cn } from "@utils/utils";
import { useCombobox } from "downshift";
import { map } from "lodash";
import React from "react";
import styled, { keyframes } from "styled-components";
import { WrapRow } from "./ComboBoxItem";
import { ComboBoxSearch } from "./ComboBoxSearch";
import { ComboboxTriggerButton } from "./ComboboxTrigger";

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
    display: ${props => (props.$isOpen ? "block" : "none")};
`;

const ComboBoxContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
`;

type ComboBoxProps = {
    items: unknown[];
    selectedItem?: unknown;
    term?: string;
    renderRow: (item: unknown) => JSX.Element;
    onFilter?: (term: string) => void;
    onChange: (item: unknown) => void;
    itemToString?: (item: unknown) => string;
    id?: string;
};

const defaultToString = (item: string) => item;

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
};

export function ComboboxDemo({ items, selectedItem, renderRow, onChange, id }: ComboBoxProps) {
    const entries =
        renderRow && map(items, item => <CommandItem onSelect={() => onChange(item)}>{renderRow(item)}</CommandItem>);

    return (
        <Popover
            className={cn("w-[545px]", "rounded-sm")}
            align={"center"}
            sideOffset={0}
            trigger={
                <button
                    className={cn(
                        "flex",
                        "justify-between",
                        "items-center",
                        "bg-white",
                        "border",
                        "border-gray-300",
                        "rounded-sm",
                        "font-medium",
                        "capitalize",
                        "w-full"
                    )}
                    id={id}
                    type="button"
                >
                    {selectedItem ? renderRow(selectedItem) : "Select user"}
                    <Icon name="chevron-down" />
                </button>
            }
        >
            <Command>
                <CommandInput />
                <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>{entries}</CommandGroup>
                </CommandList>
            </Command>
        </Popover>
    );
}
