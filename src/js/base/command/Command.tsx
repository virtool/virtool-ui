import { cn } from "@utils/utils";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

type CommandProps = {
    children: React.ReactNode;
    className?: string;
};

export function Command({ children, className }: CommandProps) {
    return (
        <CommandPrimitive
            className={cn(
                "flex",
                "h-full",
                "w-full",
                "flex-col",
                "overflow-hidden",
                "rounded-md",
                "bg-popover",
                "text-popover-foreground",
                className
            )}
        >
            {children}
        </CommandPrimitive>
    );
}
