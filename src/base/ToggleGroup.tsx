import { cn } from "../app/utils";
import * as RadixToggleGroup from "@radix-ui/react-toggle-group";
import React from "react";

type ToggleGroupProps = {
    children: React.ReactNode;
    className?: string;
    onValueChange: (value: string) => void;
    value: string;
};

export default function ToggleGroup({
    children,
    className,
    onValueChange,
    value,
}: ToggleGroupProps) {
    function handleValueChange(value: string) {
        if (value) {
            onValueChange(value);
        }
    }

    return (
        <RadixToggleGroup.Root
            className={cn("inline-flex", className)}
            onValueChange={handleValueChange}
            type="single"
            value={value}
        >
            {children}
        </RadixToggleGroup.Root>
    );
}
