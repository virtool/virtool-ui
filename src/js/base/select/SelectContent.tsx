import { Content, Portal, ScrollDownButton, ScrollUpButton, Viewport } from "@radix-ui/react-select";
import React from "react";
import styled, { keyframes } from "styled-components";
import { borderRadius, boxShadow, getColor } from "../../app/theme";
import { Icon } from "../Icon";

const ContentOpen = keyframes`  
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledContent = styled(Content)`
    transform-origin: top center;
    animation: ${ContentOpen} 150ms cubic-bezier(0.16, 1, 0.3, 1);
    background-color: white;
    border-radius: ${borderRadius.md};
    box-shadow: ${boxShadow.md};
    overflow: hidden;
    z-index: 110;
    max-height: var(--radix-select-content-available-height);
    min-width: var(--radix-select-trigger-width);

    :first-child {
        margin-top: 10px;
    }
`;

const ScrollSection = styled(ScrollUpButton)`
    margin: 5px 0;
    display: flex;
    justify-content: center;
    :hover {
        background-color: ${props => getColor({ color: "greyHover", theme: props.theme })};
    }
`;

export const SelectContent = ({ children, position, align }) => {
    return (
        <Portal>
            <StyledContent position={position} align={align} side="bottom" avoidCollisions={false}>
                <ScrollSection>
                    <Icon name="chevron-up" />
                </ScrollSection>
                <Viewport>{children}</Viewport>
                <ScrollSection as={ScrollDownButton}>
                    <Icon name="chevron-down" />
                </ScrollSection>
            </StyledContent>
        </Portal>
    );
};
