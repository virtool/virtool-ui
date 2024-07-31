import { cn } from "@utils/utils";
import React from "react";

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * Main page content container
 */
export function Container({ children, className }: ContainerProps) {
    return <div className={cn("max-w-full", "px-9", "pl-28", "w-screen", className)}>{children}</div>;
}
