import React from "react";
import styled, { keyframes } from "styled-components";
import { getColor } from "../app/theme";

const rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    50% { 
        transform: rotate(180deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

interface StyledLoaderProps {
    size?: string;
}

const StyledLoader = styled.div<StyledLoaderProps>`
    animation: ${rotate} 0.75s 0s infinite linear;
    border: 2px solid ${getColor};
    border-bottom-color: transparent !important;
    border-radius: 100%;
    background: transparent;
    animation-fill-mode: both;
    display: inline-block;
    height: ${props => props.size};
    width: ${props => props.size};
`;

interface LoaderProps extends StyledLoaderProps {
    className?: string;
    color?: string;
}

export function Loader({ className, color = "greyDark", size = "22px" }: LoaderProps) {
    return (
        <StyledLoader aria-label="loading" className={className} color={color} size={size}>
            <div />
        </StyledLoader>
    );
}
