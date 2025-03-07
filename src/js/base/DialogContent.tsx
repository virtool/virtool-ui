import { cn } from "@/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

type DialogContentProps = {
    children: React.ReactNode;
    className?: string;
    size?: "sm" | "lg";
};

/**
 * A styled dialog content container with customizable sizes
 */
export default function DialogContent({
    children,
    className,
    size,
}: DialogContentProps) {
    return (
        <DialogPrimitive.Content
            className={cn(
                "data-[state=open]:animate-contentShow",
                "fixed",
                "top-[40%]",
                "left-[50%]",
                "-translate-x-1/2",
                "-translate-y-1/2",
                "rounded-lg",
                "bg-white",
                "p-8",
                "shadow-2xl",
                "focus:outline-none",
                "z-50",
                "w-[600px]",
                { "w-[900px]": size === "lg" },
                className,
            )}
        >
            {children}
        </DialogPrimitive.Content>
    );
}
