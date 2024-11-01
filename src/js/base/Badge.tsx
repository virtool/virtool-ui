import { cn } from "@utils/utils";
import React from "react";

type BadgeProps = {
    children: React.ReactNode;
    className?: string;
    color?: "blue" | "green" | "gray" | "orange" | "purple" | "red";
};

/**
 * A styled Badge component
 */
export function Badge({ children, className, color = "gray" }: BadgeProps) {
    return (
        <span
            className={cn(
                "text-white",
                "text-sm",
                "rounded-xl",
                "inline-block",
                "min-w-3",
                "py-1",
                "px-2",
                "font-bold",
                "leading-none",
                "text-center",
                "align-middle",
                "whitespace-nowrap",
                {
                    "bg-blue-600": color === "blue",
                    "bg-green-600": color === "green",
                    "bg-gray-500": color === "gray",
                    "bg-orange-600": color === "orange",
                    "bg-purple-600": color === "purple",
                    "bg-red-600": color === "red",
                },
                className,
            )}
        >
            {children}
        </span>
    );
}
