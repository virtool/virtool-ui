import { DialogContent } from "@/base";
import { cn } from "@utils/utils";
import React from "react";

/**
 * A styled dialog content for use in an analysis creation dialog
 */
export function CreateAnalysisDialogContent({ children }) {
    return (
        <DialogContent
            className={cn(
                "max-h-[90vh]",
                "overflow-auto",
                "top-[45%]",
                "w-[700px]",
            )}
        >
            <div className={cn("flex", "flex-col", "h-full")}>{children}</div>
        </DialogContent>
    );
}
