import { cn } from "@/app/utils";
import React from "react";
import Box from "./Box";
import Icon from "./Icon";
import { noneFoundStyle } from "./noneFoundStyle";

interface NoneFoundBoxProps {
    children?: React.ReactNode;
    className?: string;
    noun: string;
}

export default function NoneFoundBox({
    className,
    noun,
    children,
}: NoneFoundBoxProps) {
    return (
        <Box className={cn(noneFoundStyle, "min-h-[30px]", className)}>
            <Icon name="info-circle" /> No {noun} found. &nbsp; {children}
        </Box>
    );
}
