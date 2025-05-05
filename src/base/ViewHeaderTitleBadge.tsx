import React from "react";
import { cn } from "../app/utils";
import Badge from "./Badge";

type ViewHeaderTitleBadge = {
    children?: React.ReactNode;
    className?: string;
    color?: "blue" | "green" | "gray" | "orange" | "purple" | "red";
};

/**
 * A styled Badge component for use in view headers
 */
export default function ViewHeaderTitleBadge({
    children,
    className,
    color,
}: ViewHeaderTitleBadge) {
    return (
        <Badge className={cn("text-base ml-2", className)} color={color}>
            {children}
        </Badge>
    );
}
