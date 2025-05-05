import React from "react";
import { cn } from "../app/utils";

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
