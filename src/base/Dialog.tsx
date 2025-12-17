import { cn } from "@app/utils";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ReactNode } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogTrigger = DialogPrimitive.Trigger;

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

type DialogContentProps = {
    children: ReactNode;
    className?: string;
    size?: "sm" | "lg";
};

/**
 * A styled dialog content container with Portal and Overlay included
 */
export function DialogContent({
    children,
    className,
    size,
}: DialogContentProps) {
    return (
        <DialogPrimitive.Portal>
            <DialogOverlay />
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
        </DialogPrimitive.Portal>
    );
}

type DialogTitleProps = {
    children: ReactNode;
};

export function DialogTitle({ children }: DialogTitleProps) {
    return (
        <DialogPrimitive.Title className="font-medium pb-4 text-2xl">
            {children}
        </DialogPrimitive.Title>
    );
}

type DialogDescriptionProps = {
    children: ReactNode;
};

export function DialogDescription({
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

type DialogFooterProps = {
    children: ReactNode;
    className?: string;
};

export function DialogFooter({ children, className }: DialogFooterProps) {
    return (
        <div className={cn("flex", "justify-end", "pt-4 pb-1", className)}>
            {children}
        </div>
    );
}

export default Dialog;
