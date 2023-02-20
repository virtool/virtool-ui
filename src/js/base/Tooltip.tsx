import React from "react";
import styled from "styled-components/macro";

import { Tooltip as TippyTooltip, TooltipProps as TippyTooltipProps } from "react-tippy";
import "react-tippy/dist/tippy.css";

interface StyledTooltipProps extends TippyTooltipProps {
    children: React.ReactNode;
}

const StyledTooltip = styled(TippyTooltip)<StyledTooltipProps>`
    display: inline-flex !important;
`;

type TooltipProps = {
    children: React.ReactNode;
    position?: "top" | "right" | "bottom" | "left";
    tip: string;
};

export function Tooltip({ tip, position = "top", children }: TooltipProps) {
    return (
        <StyledTooltip size="regular" title={tip} position={position} arrow>
            {children}
        </StyledTooltip>
    );
}
