import { ReactNode } from "react";
import styled, { DefaultTheme } from "styled-components";
import BoxGroupSection from "./BoxGroupSection";

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
    children: ReactNode;
    className?: string;
    onClick?: () => void;
};

export default function SelectBoxGroupSection({
    active,
    children,
    className,
    onClick,
}: BoxGroupSectionSelectProps) {
    return (
        <StyledSelectBoxGroupSection
            active={active}
            aria-role="option"
            className={className}
            onClick={onClick}
        >
            {children}
        </StyledSelectBoxGroupSection>
    );
}
