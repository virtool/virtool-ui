import React from "react";
import { cn } from "@/app/utils";

interface BaseWorkflowTagProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Base workflow tag component.
 *
 * @returns A base WorkflowTag component.
 */
export function BaseWorkflowTag({ children, className }: BaseWorkflowTagProps) {
    return (
        <div
            className={cn(
                "flex items-center bg-purple-800 text-white text-xs font-bold px-2 py-0.5",
                "first:rounded-l-sm last:rounded-r-sm",
                "[&:not(:last-child)]:border-r-2 [&:not(:last-child)]:border-purple-400",
                "[&_i.fas]:leading-[inherit] [&_span:last-child]:ml-0.5",
                className
            )}
        >
            {children}
        </div>
    );
}
