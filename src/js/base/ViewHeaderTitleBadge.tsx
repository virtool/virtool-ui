import { Badge } from "@base/Badge";
import { cn } from "@utils/utils";
import React from "react";

type ViewHeaderTitleBadge = {
    children?: React.ReactNode;
    className?: string;
    color?: "blue" | "green" | "gray" | "orange" | "purple" | "red";
};

/**
 * A styled Badge component for use in view headers
 */
export function ViewHeaderTitleBadge({ children, className, color }: ViewHeaderTitleBadge) {
    return (
        <Badge className={cn("text-base ml-2", className)} color={color}>
            {children}
        </Badge>
    );
}
