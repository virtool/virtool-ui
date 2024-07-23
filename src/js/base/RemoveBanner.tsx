import React from "react";
import styled, { DefaultTheme } from "styled-components";
import { Alert } from "./Alert";
import { Button } from "./Button";

interface StyledRemoveBannerProps {
    theme: DefaultTheme;
}

const StyledRemoveBanner = styled(Alert)<StyledRemoveBannerProps>`
    align-items: center;
    justify-content: space-between;

    span:first-child {
        font-weight: ${props => props.theme.fontWeight.thick};

        strong {
            font-weight: ${props => props.theme.fontWeight.bold};
        }
    }
`;

interface RemoveBannerProps {
    message: string;
    buttonText: string;
    onClick: () => void;
}

export function RemoveBanner({ message, buttonText, onClick }: RemoveBannerProps) {
    return (
        <StyledRemoveBanner color="red">
            <strong>{message}</strong>
            <Button color="red" onClick={onClick}>
                {buttonText}
            </Button>
        </StyledRemoveBanner>
    );
}
