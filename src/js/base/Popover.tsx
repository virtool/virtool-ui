import { borderRadius, boxShadow, getBorder } from "@app/theme";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import React from "react";
import styled, { keyframes } from "styled-components";

const slideDownAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PopoverContent = styled(PopoverPrimitive.Content)`
    background-color: ${props => props.theme.color.white};
    border: ${getBorder};
    border-radius: ${borderRadius.lg};
    box-shadow: ${boxShadow.lg};
    margin: 5px;
    width: 320px;
    z-index: 1;

    animation-duration: 400ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;

    &[data-state="open"][data-side="top"] {
        animation-name: ${slideDownAndFade};
    }
`;

export function Popover({ children, trigger }) {
    return (
        <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
                <PopoverContent sideOffset={15} align="end" alignOffset={-20}>
                    {children}
                </PopoverContent>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}
