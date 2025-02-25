import * as RadixCheckbox from "@radix-ui/react-checkbox";
import styled from "styled-components";

function getBackgroundColor({ checked, theme }): string {
    return theme.color[checked ? "primary" : "transparent"];
}

function getCheckboxBorder({ checked, theme }): string {
    return checked ? "none" : `2px solid ${theme.color.greyDark}`;
}

function getCheckboxColor({ checked, theme }): string {
    return theme.color[checked ? "white" : "grey"];
}

export const StyledCheckbox = styled(RadixCheckbox.Root)`
    align-items: center;
    background-color: ${getBackgroundColor};
    border: ${getCheckboxBorder};
    border-radius: ${(props) => props.theme.borderRadius.sm};
    color: ${getCheckboxColor};
    cursor: pointer;
    display: inline-flex;
    font-size: 11px;
    height: 20px;
    justify-content: center;
    margin-right: 0;
    opacity: ${(props) => (props.checked ? 1 : 0.5)};
    transition: opacity 100ms ease;
    width: 20px;
`;
