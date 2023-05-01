import React, { ReactNode } from "react";
import styled from "styled-components";
import { BoxGroupSection, Label } from "../../../base";

const StyledSelectorItem = styled(BoxGroupSection)`
    align-items: center;
    background-color: white;
    display: flex;
    justify-content: space-between;
    user-select: none;

    span:first-child {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
`;

interface SelectorItemProps {
    children: ReactNode;
    className?: string;
    isDefault?: boolean;
    onClick: () => void;
}

export function SelectorItem({ children, className = "", onClick, isDefault = false }: SelectorItemProps) {
    return (
        <StyledSelectorItem as={onClick ? "button" : "div"} className={className} onClick={onClick}>
            <span>{children}</span>
            {isDefault ? <Label>Default</Label> : null}
        </StyledSelectorItem>
    );
}
