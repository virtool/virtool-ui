import { Command } from "@base/command/Command";
import { CommandEmpty } from "@base/command/CommandEmpty";
import { CommandGroup } from "@base/command/CommandGroup";
import { CommandInput } from "@base/command/CommandInput";
import { CommandItem } from "@base/command/CommandItem";
import { CommandList } from "@base/command/CommandList";
import { Icon } from "@base/Icon";
import { Popover } from "@base/Popover";
import { cn } from "@utils/utils";
import { map } from "lodash";
import React, { useState } from "react";

type ComboBoxProps = {
    id?: string;
    items: unknown[];
    onChange: (item: unknown) => void;
    renderRow: (item: unknown) => JSX.Element;
    selectedItem?: unknown;
};

/**
 * A styled combobox displaying a list of items with built-in input search
 */
export function Combobox({ id, items, onChange, renderRow, selectedItem }: ComboBoxProps) {
    const [open, setOpen] = useState(false);

    const entries =
        renderRow &&
        map(items, item => (
            <CommandItem
                onSelect={() => {
                    onChange(item);
                    setOpen(false);
                }}
            >
                {renderRow(item)}
            </CommandItem>
        ));

    return (
        <Popover
            className={cn("w-[545px]", "rounded-sm")}
            align="center"
            open={open}
            onOpenChange={setOpen}
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
                    {selectedItem ? renderRow(selectedItem) : `Select ${id}`}
                    <Icon name="chevron-down" />
                </button>
            }
        >
            <Command>
                <CommandInput />
                <CommandList>
                    <CommandEmpty id={id} />
                    <CommandGroup>{entries}</CommandGroup>
                </CommandList>
            </Command>
        </Popover>
    );
}
