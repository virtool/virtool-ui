import { cn } from "@app/utils";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { ReactNode } from "react";

type ToggleGroupProps = {
    children: ReactNode;
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
        <ToggleGroupPrimitive.Root
            className={cn("inline-flex", className)}
            onValueChange={handleValueChange}
            type="single"
            value={value}
        >
            {children}
        </ToggleGroupPrimitive.Root>
    );
}
