import * as Select from "@radix-ui/react-select";
import React from "react";
import styled from "styled-components";
import { borderRadius, boxShadow, getColor } from "../../app/theme";
import { Icon } from "../Icon";

const Content = styled(Select.Content)`
    background-color: white;
    border-radius: ${borderRadius["md"]};
    box-shadow: ${boxShadow["md"]};
    overflow: hidden;
    z-index: 110;
    max-height: var(--radix-select-content-available-height);
    min-width: var(--radix-select-trigger-width);
`;

const ScrollSection = styled(Select.ScrollUpButton)`
    margin: 5px 0;
    display: flex;
    justify-content: center;
    :hover {
        background-color: ${props => getColor({ color: "greyHover", theme: props.theme })};
    }
`;

export const SelectContent = ({ children, position, align }) => {
    return (
        <Select.Portal>
            <Content position={position} align={align} side="bottom" avoidCollisions={false}>
                <ScrollSection>
                    <Icon name="chevron-up" />
                </ScrollSection>
                <Select.Viewport>{children}</Select.Viewport>
                <ScrollSection as={Select.ScrollDownButton}>
                    <Icon name="chevron-down" />
                </ScrollSection>
            </Content>
        </Select.Portal>
    );
};
