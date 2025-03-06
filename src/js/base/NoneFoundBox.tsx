import React from "react";
import styled from "styled-components";
import Box from "./Box";
import { Icon } from "./Icon";
import { noneFoundStyle } from "./noneFoundStyle";

interface NoneFoundBoxProps {
    children?: React.ReactNode;
    className?: string;
    noun: string;
}

const StyledNoneFoundBox = styled(Box)`
    ${noneFoundStyle}
    min-height: 30px;
`;

export function NoneFoundBox({ className, noun, children }: NoneFoundBoxProps) {
    return (
        <StyledNoneFoundBox as={Box} className={className}>
            <Icon name="info-circle" /> No {noun} found. &nbsp; {children}
        </StyledNoneFoundBox>
    );
}
