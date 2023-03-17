import * as DialogPrimitive from "@radix-ui/react-dialog";
import styled, { keyframes } from "styled-components";

const dialogContentOpen = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

interface DialogContentProps {
    size?: "sm" | "lg";
}

export const DialogContent = styled(DialogPrimitive.Content)<DialogContentProps>`
    animation: ${dialogContentOpen} 150ms cubic-bezier(0.16, 1, 0.3, 1);
    background-color: ${props => props.theme.color.white};
    border-radius: ${props => props.theme.borderRadius.md};
    box-shadow: ${props => props.theme.boxShadow.lg};
    position: fixed;
    top: 40%;
    left: 50%;
    padding: 25px;
    transform: translate(-50%, -50%);
    width: ${props => (props.size === "lg" ? "900px" : "600px")};
    z-index: 110;
`;
