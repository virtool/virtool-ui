import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@utils/utils";
import React from "react";

type PopoverProps = {
    align?: "center" | "start" | "end";
    children: React.ReactNode;
    className?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    sideOffset?: number;
    trigger: React.ReactNode;
};

/**
 * A styled popover component
 */
export function Popover({
    align = "end",
    children,
    className,
    open,
    onOpenChange,
    sideOffset = 15,
    trigger,
}: PopoverProps) {
    return (
        <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
            <PopoverPrimitive.Content
                className={cn(
                    "bg-white",
                    "rounded-lg",
                    "border",
                    "border-gray-300",
                    "shadow-lg",
                    "m-1.5",
                    "w-[320px]",
                    "z-10",
                    className
                )}
                sideOffset={sideOffset}
                align={align}
                alignOffset={-20}
            >
                {children}
            </PopoverPrimitive.Content>
        </PopoverPrimitive.Root>
    );
}
