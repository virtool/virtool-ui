import { ReactNode } from "react";
import styled from "styled-components";

const BoxGroupDisabledOverlay = styled.div`
    background-color: ${(props) => props.theme.color.greyLightest};
    opacity: 0.5;
    position: absolute;
    z-index: 10;

    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
`;

const StyledBoxGroupDisabled = styled.div`
    position: relative;
`;

type BoxGroupDisabledProps = {
    children: ReactNode;
    disabled?: boolean;
};

export default function BoxGroupDisabled({
    children,
    disabled = false,
}: BoxGroupDisabledProps) {
    return (
        <StyledBoxGroupDisabled>
            {disabled && <BoxGroupDisabledOverlay />}
            {children}
        </StyledBoxGroupDisabled>
    );
}
