import React from "react";
import { cn } from "../../../app/utils";
import DialogContent from "../../../base/DialogContent";

/**
 * A styled dialog content for use in an analysis creation dialog
 */
export default function CreateAnalysisDialogContent({ children }) {
    return (
        <DialogContent
            className={cn(
                "min-h-1/2",
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
