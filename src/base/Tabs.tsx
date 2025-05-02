import { cn } from "../app/utils";
import React from "react";

type TabsProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * A styled tabs component used for navigating
 */
export default function Tabs({ children, className }: TabsProps) {
    return (
        <nav
            className={cn(
                "border-b",
                "border-gray-300",
                "flex",
                "mb-4",
                "w-full",
                className,
            )}
        >
            {children}
        </nav>
    );
}
