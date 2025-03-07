import { cn } from "@/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import React from "react";

type PopoverProps = {
    align?: "center" | "start" | "end";
    children: React.ReactNode;
    trigger: React.ReactNode;
};

/**
 * A styled popover component
 */
export default function Popover({
    align = "end",
    children,
    trigger,
}: PopoverProps) {
    return (
        <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger asChild>
                {trigger}
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
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
                    )}
                    sideOffset={15}
                    align={align}
                    alignOffset={-20}
                >
                    {children}
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}
