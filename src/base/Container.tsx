import React from "react";
import { cn } from "../app/utils";

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * Main page content container
 */
export default function Container({ children, className }: ContainerProps) {
    return (
        <div
            className={cn("max-w-full", "px-9", "pl-28", "w-screen", className)}
        >
            {children}
        </div>
    );
}
