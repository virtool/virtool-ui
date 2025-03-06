import { cn } from "@/utils";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import React from "react";
import { Icon } from "./Icon";

type CheckboxProps = {
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    id: string;
    onClick?: () => void;
};

export function Checkbox({
    checked = false,
    id,
    label,
    onClick,
}: CheckboxProps) {
    return (
        <div className="inline-flex items-center gap-2.5">
            <RadixCheckbox.Root
                aria-label={label || "checkbox"}
                checked={checked}
                className={cn(
                    {
                        "bg-cyan-600": checked,
                    },
                    "border-2",
                    {
                        "border-gray-300": !checked,
                        "border-cyan-600": checked,
                    },
                    "inline-flex",
                    "items-center",
                    "justify-center",
                    "rounded",
                    "size-7",
                )}
                id={id}
                onClick={onClick}
            >
                <RadixCheckbox.Indicator>
                    <Icon
                        className={cn({ invisible: !checked }, "text-white")}
                        name="check"
                    />
                </RadixCheckbox.Indicator>
            </RadixCheckbox.Root>
            {label && (
                <label className="font-normal m-0 select-none" htmlFor={id}>
                    {label}
                </label>
            )}
        </div>
    );
}
