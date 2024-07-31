import { cn } from "@utils/utils";
import React from "react";

type ContainerWideProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * Full-width page content container
 */
export function ContainerWide({ children, className }: ContainerWideProps) {
    return <div className={cn("absolute", "left-7", "right-7", className)}>{children}</div>;
}
