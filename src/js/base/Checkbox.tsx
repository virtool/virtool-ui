import { cn } from "@/utils";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import React from "react";
import { Icon } from "./Icon";

type CheckboxProps = {
    checked?: boolean;
    label?: string;
    labelComponent?: React.ReactNode;
    disabled?: boolean;
    id: string;
    onClick?: () => void;
};

export function Checkbox({
    checked = false,
    id,
    label,
    labelComponent,
    onClick,
}: CheckboxProps) {
    return (
        <div className="inline-flex items-center gap-3">
            <RadixCheckbox.Root
                aria-label={label || "checkbox"}
                checked={checked}
                className={cn(
                    {
                        "bg-cyan-700": checked,
                        "border-gray-50": !checked,
                    },
                    "border-2",
                    {
                        "border-gray-300": !checked,
                        "border-cyan-700": checked,
                    },
                    "inline-flex",
                    "items-center",
                    "justify-center",
                    "rounded",
                    "size-6",
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
                <label
                    className="flex gap-2 items-center font-normal m-0 select-none"
                    htmlFor={id}
                >
                    {labelComponent || label}
                </label>
            )}
        </div>
    );
}

export default Checkbox;
