import { cn } from "@/utils";
import Link from "@base/Link";
import React from "react";

interface LinkButtonProps {
    children?: React.ReactNode;
    className?: string;
    color?: "blue" | "gray" | "green" | "red";
    replace?: boolean;
    to: string;
}

export default function LinkButton({
    children,
    className,
    color = "gray",
    replace = false,
    to,
}: LinkButtonProps) {
    return (
        <Link
            className={cn(
                className,
                "items-center",
                {
                    "bg-blue-600": color === "blue",
                    "bg-gray-200": color === "gray",
                    "bg-green-600": color === "green",
                    "bg-red-600": color === "red",
                },
                "inline-flex",
                "font-medium",
                "min-h-10",
                "px-4",
                "rounded-md",
                {
                    "text-black": ["gray"].includes(color),
                    "text-white": ["blue", "green", "red"].includes(color),
                },
                "text-lg",
                "hover:shadow-lg",
                {
                    "hover:text-black": ["gray"].includes(color),
                    "hover:text-white": ["blue", "green", "red"].includes(
                        color,
                    ),
                },
            )}
            replace={replace}
            to={to}
        >
            {children}
        </Link>
    );
}
