import { cn } from "@/app/utils";
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

interface BaseWorkflowTagProps<T extends ElementType = "div"> {
    as?: T;
    children: ReactNode;
    className?: string;
}

/**
 * Base workflow tag component.
 *
 * @returns A base WorkflowTag component.
 */
export function BaseWorkflowTag<T extends ElementType = "div">({
    as,
    children,
    className,
    ...props
}: BaseWorkflowTagProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof BaseWorkflowTagProps<T>>) {
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
