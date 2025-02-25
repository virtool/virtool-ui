import { Badge } from "@base/Badge";
import { cn } from "@utils/utils";
import React from "react";

type BoxGroupHeaderBadgeProps = {
    children?: React.ReactNode;
    className?: string;
};

/**
 * A styled Badge component for use in a BoxGroupHeader
 */
export function BoxGroupHeaderBadge({
    children,
    className,
}: BoxGroupHeaderBadgeProps) {
    return <Badge className={cn("ml-2", className)}>{children}</Badge>;
}
