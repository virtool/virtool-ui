import React from "react";
import styled, { DefaultTheme } from "styled-components";
import { BoxGroupSection } from "./BoxGroupSection";

type SelectBoxGroupSectionProps = {
    active?: boolean;
    theme: DefaultTheme;
};

const StyledSelectBoxGroupSection = styled(
    BoxGroupSection,
)<SelectBoxGroupSectionProps>`
    background-color: ${(props) =>
        props.active ? props.theme.color.blue : "transparent"};
    color: ${(props) => (props.active ? props.theme.color.white : "inherit")};
    cursor: pointer;
    width: 100%;

    &:focus {
        box-shadow: inset 0 0 0 2px rgba(43, 108, 176, 0.5);
        outline: none;
    }
`;

type BoxGroupSectionSelectProps = {
    active?: boolean;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
};

export function SelectBoxGroupSection({
    active,
    children,
    className,
    onClick,
}: BoxGroupSectionSelectProps) {
    function handleKeyDown(e) {
        if (e.key === "Enter") {
            onClick();
        }
    }

    return (
        <StyledSelectBoxGroupSection
            active={active}
            className={className}
            tabIndex={0}
            role="option"
            onClick={onClick}
            onKeyDown={handleKeyDown}
        >
            {children}
        </StyledSelectBoxGroupSection>
    );
}
