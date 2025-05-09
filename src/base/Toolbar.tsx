import { cn } from "@app/utils";
import React from "react";

type ToolbarProps = {
    children: React.ReactNode;
    className?: string;
};

export default function Toolbar({ children, className }: ToolbarProps) {
    return (
        <div className={cn(className, "flex gap-2 items-stretch mb-3")}>
            {children}
        </div>
    );
}
