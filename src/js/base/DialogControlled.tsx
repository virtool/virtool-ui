import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";
import { DialogContent } from "./DialogContent";
import { DialogOverlay } from "./DialogOverlay";

interface DialogControlledProps {
    children: React.ReactNode;
    show: boolean;
    onHide: () => void;
    onOpenChange?: (open: boolean) => void;
}

export function DialogControlled({ children, show, onHide, onOpenChange }: DialogControlledProps) {
    function handleOpenChange(open: boolean) {
        onOpenChange?.(open);

        if (!open) {
            onHide();
        }
    }

    return (
        <DialogPrimitive.Root open={show} onOpenChange={handleOpenChange}>
            <DialogPrimitive.Portal>
                <DialogOverlay />
                <DialogContent>{children}</DialogContent>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
