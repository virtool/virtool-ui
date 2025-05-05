import React from "react";
import { cn } from "../app/utils";

type ContainerNarrowProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * Smaller page content container such as for file managers and settings
 */
export default function ContainerNarrow({
    children,
    className,
}: ContainerNarrowProps) {
    return (
        <div
            className={cn("flex-grow", "flex-shrink-0", "max-w-6xl", className)}
        >
            {children}
        </div>
    );
}
