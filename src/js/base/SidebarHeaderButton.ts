import { boxShadow, getFontSize } from "@app/theme";
import styled from "styled-components";

const SidebarHeaderButton = styled.button`
    align-items: center;
    background-color: ${(props) => props.theme.color.greyLightest};
    border: none;
    border-radius: 50%;
    color: ${(props) => props.theme.color.greyDark};
    cursor: pointer;
    display: flex;
    font-size: ${getFontSize("md")};
    justify-content: center;
    height: 32px;
    width: 32px;

    &:hover,
    &:focus {
        background-color: ${(props) => props.theme.color.greyDark};
        box-shadow: ${boxShadow.sm};
        color: ${(props) => props.theme.color.white};
        outline: none;
    }

    &:focus {
        background-color: ${(props) => props.theme.color.grey};
    }
`;

SidebarHeaderButton.displayName = "SidebarHeaderButton";

export default SidebarHeaderButton;
