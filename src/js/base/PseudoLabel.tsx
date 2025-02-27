import { cn } from "@utils/utils";
import React from "react";

type PseudoLabelProps = {
    children: React.ReactNode;
    className?: string;
};

export default function PseudoLabel({ children, className }: PseudoLabelProps) {
    return (
        <label className={cn("font-medium", "mb-2", className)}>
            {children}
        </label>
    );
}
