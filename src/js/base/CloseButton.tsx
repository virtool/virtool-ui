import React from "react";
import styled from "styled-components/macro";
import { Icon } from "./Icon";

const StyledCloseButton = styled(Icon)`
    color: inherit;
`;

type CloseButtonProps = {
    onClick: () => void;
};

export function CloseButton({ onClick }: CloseButtonProps) {
    return <StyledCloseButton aria-label="close" name="times" onClick={onClick} />;
}
