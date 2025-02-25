import * as RadixCheckbox from "@radix-ui/react-checkbox";
import React from "react";
import styled from "styled-components";
import { CheckboxLabel } from "./CheckboxLabel";
import { Icon } from "./Icon";
import { StyledCheckbox } from "./styled/StyledCheckbox";

const CheckboxContainer = styled.div`
    display: inline-flex;
`;

type CheckboxProps = {
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    onClick?: () => void;
};

export function Checkbox({
    checked = false,
    label,
    onClick,
    disabled = false,
}: CheckboxProps) {
    return (
        <CheckboxContainer>
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
                <CheckboxLabel onClick={disabled ? null : onClick}>
                    {label}
                </CheckboxLabel>
            ) : null}
        </CheckboxContainer>
    );
}

Checkbox.displayName = "Checkbox";
