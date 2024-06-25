import { cn } from "@utils/utils";
import React from "react";

type LabelProps = {
    children?: React.ReactNode;
    className?: string;
};

/**
 * A styled Label component
 */
export function Label({ children, className }: LabelProps) {
    return (
        <span
            className={cn(
                `text-white rounded inline whitespace-nowrap text-center font-bold px-2 py-1 text-sm align-baseline last-of-type:m-0 bg-greyDark`,
                className,
            )}
        >
            {children}
        </span>
    );
}
