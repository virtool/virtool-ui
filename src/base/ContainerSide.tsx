import { cn } from "../app/utils";
import React from "react";

type ContainerSideProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * Sidebar content container
 */
export default function ContainerSide({
    children,
    className,
}: ContainerSideProps) {
    return <div className={cn("flex-none", className)}>{children}</div>;
}
