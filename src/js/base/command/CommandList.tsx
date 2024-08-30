import { cn } from "@utils/utils";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

type CommandListProps = {
    children: React.ReactNode;
    className?: string;
};

export function CommandList({ children, className }: CommandListProps) {
    return (
        <CommandPrimitive.List className={cn("max-h-[300px]", "overflow-y-auto", "overflow-x-hidden", className)}>
            {children}
        </CommandPrimitive.List>
    );
}
