import React from "react";
import { cn } from "@/app/utils";

interface BaseSampleLabelProps {
    children: React.ReactNode;
    className?: string;
    color?: string;
}

/**
 * The base sample label component
 */
export function BaseSampleLabel({ children, className, color }: BaseSampleLabelProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center bg-white border border-gray-300 rounded-md px-2 py-1 [&_i.fas]:mr-1",
                color && `[&_i.fas]:text-[${color}]`,
                className
            )}
        >
            {children}
        </span>
    );
}
