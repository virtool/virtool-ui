import React from "react";
import styled, { DefaultTheme } from "styled-components/macro";
import { StyledProgress } from "./styled/StyledProgress";

interface ProgressBarAffixedProps {
    bottom?: boolean;
    className?: string;
    color?: string;
    now: number;
}

interface StyledProgressBarAffixedProps {
    bottom?: boolean;
    className?: string;
    max: string;
    theme: DefaultTheme;
    value: number;
}

const StyledProgressBarAffixed = styled(StyledProgress)<StyledProgressBarAffixedProps>`
    height: 5px;
    left: 0;
    margin: 0;
    overflow: hidden;
    position: absolute;
    background-color: transparent;

    ${props => (props.bottom ? "bottom" : "top")}: 0;

    ::-webkit-progress-bar {
        background-color: transparent;
    }
`;

export const ProgressBarAffixed = styled(({ className, now, color, bottom }: ProgressBarAffixedProps) => {
    return <StyledProgressBarAffixed className={className} max="100" value={now} color={color} bottom={bottom} />;
})``;
