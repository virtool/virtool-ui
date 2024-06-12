import { theme } from "@app/theme";
import { getBadgeOrLabelColor } from "@base/utils";
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
            className={`text-[${theme.color.white}] rounded-[${theme.borderRadius.sm}] bg-[${getBadgeOrLabelColor({
                color,
            })}] inline whitespace-nowrap text-center font-bold px-2 py-1 text-[${
                theme.fontSize.sm
            }] ${className} align-baseline last-of-type:m-0 `}
        >
            {children}
        </span>
    );
}
