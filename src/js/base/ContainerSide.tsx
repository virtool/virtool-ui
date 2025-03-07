import { cn } from "@/utils";
import React from "react";

type ContainerSideProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * Sidebar content container
 */
export function ContainerSide({ children, className }: ContainerSideProps) {
    return <div className={cn("flex-none", className)}>{children}</div>;
}

export default ContainerSide;
