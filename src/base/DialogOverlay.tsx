import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";
import { cn } from "../app/utils";

/**
 * A styled semi-transparent overlay for a dialog
 */
export default function DialogOverlay() {
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
