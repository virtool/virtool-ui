import { cn } from "../app/utils";
import React from "react";

type BoxProps = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
};

function Box({ children, className = "", onClick, ...rest }: BoxProps) {
    return (
        <div
            className={cn(
                { "hover:bg-gray-100": onClick },
                "border-1",
                "border-gray-300",
                { "cursor-pointer": onClick },
                "mb-6",
                "py-4",
                "px-4",
                "relative",
                "rounded-sm",
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    );
}

export default Box;
