import { cn } from "@utils/utils";
import React from "react";

type ContainerSideProps = {
    children: React.ReactNode;
    className?: string;
};

export function ContainerSide({ children, className }: ContainerSideProps) {
    return <div className={cn("flex-none", className)}>{children}</div>;
}
