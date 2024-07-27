import { cn } from "@utils/utils";
import React from "react";

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
};

export function Container({ children, className }: ContainerProps) {
    return <div className={cn("max-w-full", "px-9", "pl-24", "w-screen", className)}>{children}</div>;
}
