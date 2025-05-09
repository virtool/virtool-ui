import { cn } from "@app/utils";
import React from "react";

type BadgeProps = {
    children: React.ReactNode;
    className?: string;
    color?: "blue" | "green" | "gray" | "orange" | "purple" | "red";
};

/**
 * A styled Badge component
 */
export default function Badge({
    children,
    className,
    color = "gray",
}: BadgeProps) {
    return (
        <span
            className={cn(
                "align-middle",
                "font-bold",
                "inline-block",
                "min-w-8",
                "px-2",
                "py-1",
                "rounded-xl",
                "text-center",
                "text-sm",
                "text-white",
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
