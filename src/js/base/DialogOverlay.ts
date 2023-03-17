import * as DialogPrimitive from "@radix-ui/react-dialog";
import styled, { keyframes } from "styled-components";

const dialogOverlayOpen = keyframes`  
    from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const DialogOverlay = styled(DialogPrimitive.Overlay)`
    animation: ${dialogOverlayOpen} 150ms cubic-bezier(0.16, 1, 0.3, 1);
    background-color: rgba(107, 114, 128, 0.6);
    inset: 0;
    position: fixed;
    z-index: 110;
`;
