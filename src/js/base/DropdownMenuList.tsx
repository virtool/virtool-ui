import { MenuList } from "@reach/menu-button";
import { keyframes } from "styled-components";
import styled from "styled-components/macro";
import { getBorder, getFontSize } from "../app/theme";

const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const DropdownMenuList = styled(MenuList)`
    animation: ${slideDown} ease-in 100ms;
    border: ${getBorder};
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: ${props => props.theme.boxShadow.lg};
    display: flex;
    flex-direction: column;
    font-size: ${getFontSize("md")};
    padding: 0;
`;
