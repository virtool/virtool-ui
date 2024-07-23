import * as Toggle from "@radix-ui/react-toggle";
import { cn } from "@utils/utils";
import React, { forwardRef } from "react";

type ButtonToggleProps = {
    children: React.ReactNode;
    onPressedChange: (pressed: boolean) => void;
    pressed: boolean;
};

export const ButtonToggle = forwardRef<HTMLButtonElement, ButtonToggleProps>(
    ({ children, onPressedChange, pressed }, ref) => {
        return (
            <Toggle.Root
                className={cn(
                    "bg-gray-200",
                    "cursor-pointer",
                    "items-center",
                    "inline-flex",
                    "font-medium",
                    "min-h-10",
                    "px-4",
                    "rounded-md",
                    "select-none",
                    "text-black",
                    "text-lg",
                    "hover:shadow-lg",
                    "active:inset-2",
                )}
                onPressedChange={onPressedChange}
                pressed={pressed}
                ref={ref}
            >
                {children}
            </Toggle.Root>
        );
    },
);

ButtonToggle.displayName = "ButtonToggle";
