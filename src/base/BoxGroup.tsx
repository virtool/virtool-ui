import React, { ReactNode } from "react";
import { cn } from "../app/utils";
import Box from "./Box";

type BoxGroupProps = {
    children: ReactNode;
    className?: string;
};

export default function BoxGroup({
    children,
    className = "",
    ...rest
}: BoxGroupProps) {
    return (
        <Box
            className={cn("p-0", "relative", "rounded-sm", className)}
            {...rest}
        >
            {children}
        </Box>
    );
}
