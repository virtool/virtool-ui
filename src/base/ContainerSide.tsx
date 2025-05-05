import React from "react";
import { cn } from "../app/utils";

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
