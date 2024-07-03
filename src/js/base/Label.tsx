import { cn } from "@utils/utils";
import React from "react";

type LabelProps = {
    children?: React.ReactNode;
    className?: string;
    color?: string;
};

/**
 * A styled Label component
 */
export function Label({ children, className, color = "grey" }: LabelProps) {
    return (
        <span
            className={cn(
                "items-center",
                "font-bold",
                "gap-1.5",
                "inline-flex",
                "px-2",
                "py-1",
                "rounded-md",
                "text-white",
                "text-sm",
                "whitespace-nowrap",
                "last-of-type:m-0",
                {
                    "bg-blue-600": color == "blue",
                    "bg-green-600": color == "green",
                    "bg-grey-500": color == "grey",
                    "bg-purple-600": color == "purple",
                    "bg-red-600": color == "red",
                },
                className,
            )}
        >
            {children}
        </span>
    );
}
