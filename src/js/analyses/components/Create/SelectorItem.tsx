import { BoxGroupSection, Label } from "@base";
import { cn } from "@utils/utils";
import React, { ReactNode } from "react";

type SelectorItemProps = {
    children: ReactNode;
    className?: string;
    isDefault?: boolean;
    onClick: () => void;
};

export function SelectorItem({ children, onClick, isDefault = false }: SelectorItemProps) {
    return (
        <BoxGroupSection
            as={onClick ? "button" : "div"}
            className={cn(
                "items-center",
                "bg-white",
                "flex",
                "justify-between",
                "select-none",
                "outline",
                "outline-1",
                "outline-gray-300"
            )}
            onClick={onClick}
        >
            <span className={cn("first:text-ellipsis", "first:whitespace-nowrap", "first:overflow-hidden")}>
                {children}
            </span>
            {isDefault ? <Label>Default</Label> : null}
        </BoxGroupSection>
    );
}
