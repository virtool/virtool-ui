import { cn } from "@utils/utils";
import React from "react";

type CheckboxLabelProps = {
    children: React.ReactNode;
    className?: string;
    onClick: () => void;
};

export function CheckboxLabel({ children, className, onClick }: CheckboxLabelProps) {
    return (
        <span className={cn("align-bottom", "cursor-pointer", "ml-2", "select-none", className)} onClick={onClick}>
            {children}
        </span>
    );
}
