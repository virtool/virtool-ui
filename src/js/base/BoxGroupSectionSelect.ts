import styled, { DefaultTheme } from "styled-components";
import { BoxGroupSection } from "./BoxGroupSection";
import { CheckboxLabel } from "./CheckboxLabel";
import { StyledCheckbox } from "./styled/StyledCheckbox";

type SelectBoxGroupSectionProps = {
    active?: boolean;
    theme: DefaultTheme;
};

export const SelectBoxGroupSection = styled(BoxGroupSection)<SelectBoxGroupSectionProps>`
    background-color: ${props => (props.active ? props.theme.color.blue : "transparent")};
    color: ${props => (props.active ? props.theme.color.white : "inherit")};
    cursor: pointer;
    width: 100%;

    &:focus {
        box-shadow: inset 0 0 0 2px rgba(43, 108, 176, 0.5);
        outline: none;
    }

    ${StyledCheckbox} {
        background-color: ${props => (props.active ? props.theme.color.white : "transparent")};
        color: ${props => props.theme.color[props.active ? "blueDark" : "greyLight"]};
        margin-right: 10px;
    }

    ${CheckboxLabel} {
        margin: 0;
    }
`;

SelectBoxGroupSection.displayName = "SelectBoxGroupSection";
