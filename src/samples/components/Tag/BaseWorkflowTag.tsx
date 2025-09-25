import { cn } from "@/app/utils";
import React from "react";

interface BaseWorkflowTagProps<T extends React.ElementType = "div"> {
    as?: T;
    children: React.ReactNode;
    className?: string;
}

/**
 * Base workflow tag component.
 *
 * @returns A base WorkflowTag component.
 */
export function BaseWorkflowTag<T extends React.ElementType = "div">({
    as,
    children,
    className,
    ...props
}: BaseWorkflowTagProps<T> &
    Omit<React.ComponentPropsWithoutRef<T>, keyof BaseWorkflowTagProps<T>>) {
    const Component = as || "div";

    return (
        <Component
            className={cn(
                "flex items-center bg-purple-800 text-white text-sm font-bold px-2 py-1.5",
                "first:rounded-l-sm last:rounded-r-sm",
                "[&:not(:last-child)]:border-r-2 [&:not(:last-child)]:border-purple-400",
                "[&_i.fas]:leading-[inherit] [&_span:last-child]:ml-0.5",
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    );
}
