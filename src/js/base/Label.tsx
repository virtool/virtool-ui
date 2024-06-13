import clsx from "clsx";
import React from "react";

type LabelProps = {
    children?: React.ReactNode;
    className?: string;
    color?: string;
};

/**
 * A styled Label component
 */
export function Label({ children, className, color }: LabelProps) {
    return (
        <span
            className={clsx(
                "text-white rounded inline whitespace-nowrap text-center font-bold px-2 py-1 text-sm align-baseline last-of-type:m-0",
                color ? `bg-${color}` : "bg-greyDark",
                className,
            )}
        >
            {children}
        </span>
    );
}
