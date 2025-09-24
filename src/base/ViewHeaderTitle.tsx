import { cn } from "@/app/utils";
import React from "react";

type ViewHeaderTitleProps = {
    children: React.ReactNode;
    className?: string;
};

function ViewHeaderTitle({ children, className }: ViewHeaderTitleProps) {
    return (
        <h1
            className={cn(
                "flex items-center text-3xl font-bold m-0",
                className,
            )}
        >
            {children}
        </h1>
    );
}

ViewHeaderTitle.displayName = "ViewHeaderTitle";

export default ViewHeaderTitle;
