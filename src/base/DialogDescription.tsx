import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";
import { cn } from "../app/utils";

type DialogDescriptionProps = {
    children: React.ReactNode;
};

export default function DialogDescription({
    children,
}: DialogDescriptionProps): JSX.Element {
    return (
        <DialogPrimitive.Description
            className={cn("font-medium", "pb-4", "text-lg", "text-slate-600")}
        >
            {children}
        </DialogPrimitive.Description>
    );
}
