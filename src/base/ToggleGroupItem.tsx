import { cn } from "@app/utils";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { ReactNode } from "react";

type ToggleGroupItemProps = {
    children: ReactNode;
    value: string;
};

export default function ToggleGroupItem({
    children,
    value,
}: ToggleGroupItemProps) {
    return (
        <ToggleGroupPrimitive.Item
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
        </ToggleGroupPrimitive.Item>
    );
}
