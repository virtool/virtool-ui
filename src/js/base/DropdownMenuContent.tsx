import { getBorder, getFontSize } from "@app/theme";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styled, { keyframes } from "styled-components";

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

export const DropdownMenuContent = styled(DropdownMenu.Content)`
    animation: ${slideDown} ease-in 100ms;
    border: ${getBorder};
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: ${props => props.theme.boxShadow.lg};
    display: flex;
    flex-direction: column;
    font-size: ${getFontSize("md")};
    margin: 0 5px;
    background-color: white;
`;
