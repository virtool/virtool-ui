import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

export default function DialogTitle({ children }) {
    return (
        <DialogPrimitive.Title className="font-medium pb-4 text-2xl">
            {children}
        </DialogPrimitive.Title>
    );
}
