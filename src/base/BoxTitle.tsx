import React from "react";
import { cn } from "@/app/utils";

type BoxTitleProps = {
    children: React.ReactNode;
    className?: string;
};

function BoxTitle({ children, className }: BoxTitleProps) {
    return (
        <h1 className={cn("font-medium mt-1 mb-4", className)}>
            {children}
        </h1>
    );
}

BoxTitle.displayName = "BoxTitle";

export default BoxTitle;
