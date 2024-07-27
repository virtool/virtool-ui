import { cn } from "@utils/utils";
import React from "react";

type ContainerWideProps = {
    children: React.ReactNode;
    className?: string;
};

export function ContainerWide({ children, className }: ContainerWideProps) {
    return <div className={cn("absolute", "left-7.5", "right-7.5", className)}>{children}</div>;
}
