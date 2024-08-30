import { cn } from "@utils/utils";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

type CommandItemProps = {
    children: React.ReactNode;
    className?: string;
    onSelect: () => void;
};

/**
 * A condensed command item for use in a command list
 */
export function CommandItem({ children, className, onSelect }: CommandItemProps) {
    return (
        <CommandPrimitive.Item
            className={cn(
                "relative",
                "hover:bg-gray-50",
                "flex",
                "cursor-pointer",
                "select-none",
                "items-center",
                "rounded-sm",
                "px-2",
                "py-3",
                "text-sm",
                "font-medium",
                "outline-none",
                "data-[disabled=true]:pointer-events-none",
                "data-[selected='true']:bg-accent",
                "data-[selected=true]:text-accent-foreground",
                "data-[disabled=true]:opacity-50",
                className
            )}
            onSelect={onSelect}
        >
            {children}
        </CommandPrimitive.Item>
    );
}
