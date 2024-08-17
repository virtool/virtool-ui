import React from "react";
import styled from "styled-components";
import { BoxGroupSection } from "./BoxGroupSection";
import { Icon } from "./Icon";
import { noneFoundStyle } from "./noneFoundStyle";

const StyledNoneFoundSection = styled(BoxGroupSection)`
    ${noneFoundStyle}
    justify-content: center;
`;

type NoneFoundSectionProps = {
    children?: React.ReactNode;
    noun: string;
};

export function NoneFoundSection({ children, noun }: NoneFoundSectionProps) {
    let childrenContainer;

    if (children) {
        childrenContainer = <span>. {children}.</span>;
    }

    return (
        <StyledNoneFoundSection>
            <Icon name="info-circle" /> No {noun} found{childrenContainer}
        </StyledNoneFoundSection>
    );
}
