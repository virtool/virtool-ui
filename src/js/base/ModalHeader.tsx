import { get } from "lodash-es";
import React, { useContext } from "react";
import styled from "styled-components";
import { getColorProps } from "../app/theme";
import { BoxGroupSection } from "./BoxGroupSection";
import { CloseButton } from "./CloseButton";
import { ModalContext } from "./ModalContext";

function getModalBackgroundColor({ color, theme }: getColorProps) {
    return get(theme.color, color, theme.color.white);
}

function getModalForegroundColor({ color, theme }: getColorProps) {
    return color ? theme.color.white : theme.color.black;
}

const StyledModalHeader = styled(BoxGroupSection)`
    align-items: center;
    background-color: ${getModalBackgroundColor};
    border-bottom: none !important;
    color: ${getModalForegroundColor};
    display: flex;
    font-size: ${props => props.theme.fontSize.lg};
    font-weight: 500;
    height: 55px;
    justify-content: space-between;
`;

StyledModalHeader.displayName = "ModalHeader";

interface ModalHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
    const { color, onHide } = useContext(ModalContext);

    return (
        <StyledModalHeader className={className} color={color}>
            {children}
            <CloseButton onClick={onHide} />
        </StyledModalHeader>
    );
}
