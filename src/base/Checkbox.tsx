import { cn } from "@app/utils";
import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { ReactNode } from "react";
import Icon from "./Icon";

type CheckboxProps = {
    checked?: boolean;
    label?: string;
    labelComponent?: ReactNode;
    disabled?: boolean;
    id: string;
    onClick?: () => void;
};

function Checkbox({
    checked = false,
    id,
    label,
    labelComponent,
    onClick,
}: CheckboxProps) {
    return (
        <div className="inline-flex items-center gap-3">
            <CheckboxPrimitive.Root
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
                    "cursor-pointer",
                    "inline-flex",
                    "items-center",
                    "justify-center",
                    "rounded",
                    "size-6",
                )}
                id={id}
                onClick={onClick}
            >
                <CheckboxPrimitive.Indicator forceMount>
                    <Icon
                        className={cn({ invisible: !checked }, "text-white")}
                        icon={Check}
                    />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            {label && (
                <label
                    className="flex gap-2 items-center font-normal m-0 select-none cursor-pointer"
                    htmlFor={id}
                >
                    {labelComponent || label}
                </label>
            )}
        </div>
    );
}

export default Checkbox;
