import { cn } from "../app/utils";
import React from "react";

type KeyProps = {
    className?: string;
    children: React.ReactNode;
};

/** A keyboard key */
export default function Key({ className, children }: KeyProps) {
    return (
        <kbd
            className={cn(
                "inline-block",
                "bg-gray-200",
                "border",
                "border-gray-400",
                "rounded-md",
                "shadow-md",
                "px-2",
                "py-1",
                "text-center",
                "align-middle",
                "font-bold",
                "text-gray-600",
                "hover:bg-gray-300",
                "active:bg-gray-400",
                className,
            )}
        >
            {children}
        </kbd>
    );
}
