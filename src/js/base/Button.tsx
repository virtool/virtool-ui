import React, { ReactNode } from "react";
import { Icon } from "./Icon";
import { Tooltip } from "./Tooltip";
import { StyledButton } from "./styled/StyledButton";

type ButtonProps = {
    active?: boolean;
    children: ReactNode;
    className?: string;
    color: string;
    disabled?: boolean;
    icon?: string;
    tip?: string;
    type?: "button" | "submit";
    onBlur?: () => void;
    onClick?: () => void;
};

export function Button({
    active,
    children,
    className,
    color = "grey",
    disabled = false,
    icon,
    tip,
    type = "button",
    onBlur,
    onClick
}: ButtonProps) {
    const button = (
        <StyledButton
            active={active}
            className={className}
            color={color}
            disabled={disabled}
            type={type}
            onBlur={onBlur}
            onClick={onClick}
        >
            {icon && <Icon name={icon} />}
            {children ? <span>{children}</span> : null}
        </StyledButton>
    );

    if (tip) {
        return <Tooltip tip={tip}>{button}</Tooltip>;
    }

    return button;
}
