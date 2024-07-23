import * as RadixToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "@utils/utils";
import React, { ReactNode } from "react";

type ToggleGroupItemProps = {
    children: ReactNode;
    value: string;
};

export function ToggleGroupItem({ children, value }: ToggleGroupItemProps) {
    return (
        <RadixToggleGroup.Item
            className={cn(
                "bg-gray-200",
                "cursor-pointer",
                "items-center",
                "inline-flex",
                "font-medium",
                "min-h-10",
                "px-4",
                "select-none",
                "text-black",
                "text-lg",
                "aria-checked:bg-gray-300",
                "first:rounded-l-md",
                "hover:shadow-lg",
                "last:rounded-r-md",
            )}
            value={value}
        >
            {children}
        </RadixToggleGroup.Item>
    );
}
