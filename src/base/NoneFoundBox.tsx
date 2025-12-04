import { cn } from "@/app/utils";
import { CircleAlert } from "lucide-react";
import { ReactNode } from "react";
import Box from "./Box";
import { noneFoundStyle } from "./noneFoundStyle";

interface NoneFoundBoxProps {
    children?: ReactNode;
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
            <CircleAlert size={18} /> No {noun} found. &nbsp; {children}
        </Box>
    );
}
