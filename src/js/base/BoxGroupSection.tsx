import { cn } from "@utils/utils";
import React, { ComponentType } from "react";

export type BoxGroupSectionProps = {
    "aria-label"?: string;
    active?: boolean;
    as?: string | ComponentType<any>;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: string;
};

export function BoxGroupSection({
    active,
    as = "div",
    children,
    className,
    disabled,
    onClick,
    type,
    ...props
}: BoxGroupSectionProps) {
    const As = as;

    return (
        <As
            className={cn(
                "bg-transparent",
                "border-r-0",
                "text-inherit",
                "block",
                "cursor-auto",
                "py-3",
                "px-4",
                "relative",
                "w-full",
                "[&:not(:last-child)]:border-b",
                "border-gray-300",
                { "cursor-pointer hover:bg-gray-50": onClick && !active },
                { "bg-gray-50 cursor-not-allowed text-gray-300 select-none": disabled },
                className
            )}
            aria-label={props["aria-label"]}
            onClick={onClick}
            type={type}
        >
            {children}
        </As>
    );
}
