import { cn } from "@app/utils";
import { Toggle } from "radix-ui";
import { ReactNode, Ref } from "react";

type ButtonToggleProps = {
    children: ReactNode;
    onPressedChange: (pressed: boolean) => void;
    pressed: boolean;
    ref?: Ref<HTMLButtonElement>;
};

export default function ButtonToggle({
    children,
    onPressedChange,
    pressed,
    ref,
}: ButtonToggleProps) {
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
}
