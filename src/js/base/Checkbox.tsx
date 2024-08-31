import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { cn } from "@utils/utils";
import React from "react";
import { CheckboxLabel } from "./CheckboxLabel";
import { Icon } from "./Icon";
import { StyledCheckbox } from "./styled/StyledCheckbox";

type CheckboxProps = {
    className?: string;
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    onClick?: () => void;
};

export function Checkbox({ className, checked = false, label, onClick, disabled = false }: CheckboxProps) {
    return (
        <div className={cn("inline-flex")}>
            <StyledCheckbox
                disabled={disabled}
                checked={checked}
                onClick={disabled ? null : onClick}
                aria-label={label || "checkbox"}
            >
                <Icon name="check" />
                <RadixCheckbox.Indicator />
            </StyledCheckbox>
            {label ? (
                <CheckboxLabel className={className} onClick={disabled ? null : onClick}>
                    {label}
                </CheckboxLabel>
            ) : null}
        </div>
    );
}
