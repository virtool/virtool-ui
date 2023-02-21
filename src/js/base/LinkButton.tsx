import { NavLink } from "react-router-dom";
import { Icon } from "./Icon";
import { Tooltip } from "./Tooltip";
import React from "react";
import { StyledButton } from "./styled/StyledButton";

interface LinkButtonProps {
    children?: React.ReactNode;
    color?: string;
    className?: string;
    disabled?: boolean;
    icon?: string;
    replace?: boolean;
    tip?: string;
    to: string | object;
    onClick?: () => void;
}

export const LinkButton = ({
    children,
    color,
    className,
    disabled = false,
    icon,
    replace,
    tip,
    to,
    onClick
}: LinkButtonProps) => {
    const button = (
        <StyledButton
            as={NavLink}
            aria-label={children || icon}
            className={className}
            color={color}
            replace={replace}
            to={to}
            disabled={disabled}
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
};
