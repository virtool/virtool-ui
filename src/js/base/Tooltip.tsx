import { boxShadow } from "@app/theme";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import React from "react";
import styled, { keyframes } from "styled-components";

const slideUpAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

const slideRightAndFade = keyframes`
    from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideLeftAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const TooltipContent = styled(TooltipPrimitive.Content)`
    border-radius: 4px;
    padding: 0.6rem 1.2rem;
    font-size: 15px;
    line-height: 1;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    box-shadow: ${boxShadow.lg};
    animation-duration: 400ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
    text-transform: capitalize;
    z-index: 20;

    &[data-state="delayed-open"][data-side="top"] {
        animation-name: ${slideDownAndFade};
    }

    &[data-state="delayed-open"][data-side="right"] {
        animation-name: ${slideLeftAndFade};
    }

    &[data-state="delayed-open"][data-side="bottom"] {
        animation-name: ${slideUpAndFade};
    }

    &[data-state="delayed-open"][data-side="left"] {
        animation-name: ${slideRightAndFade};
    }
`;

type TooltipProps = {
    children: React.ReactNode;
    position?: "top" | "right" | "bottom" | "left";
    tip: React.ReactNode;
};

export default function Tooltip({
    children,
    position = "top",
    tip,
}: TooltipProps) {
    return (
        <TooltipPrimitive.Provider>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipContent side={position} sideOffset={5}>
                        {tip}
                        <TooltipPrimitive.Arrow />
                    </TooltipContent>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}
