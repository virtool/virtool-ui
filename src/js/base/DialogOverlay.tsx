import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/utils";
import React from "react";

/**
 * A styled semi-transparent overlay for a dialog
 */
export function DialogOverlay() {
    return (
        <DialogPrimitive.Overlay
            className={cn(
                "data-[state=open]:animate-overlayShow",
                "bg-gray-500/60",
                "fixed",
                "inset-0",
                "z-40",
            )}
        />
    );
}
