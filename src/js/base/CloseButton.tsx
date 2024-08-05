import { IconButton } from "@base/IconButton";
import React from "react";
import styled from "styled-components";

const StyledCloseButton = styled(IconButton)`
    color: inherit;
`;

type CloseButtonProps = {
    onClick: () => void;
};

export function CloseButton({ onClick }: CloseButtonProps) {
    return <StyledCloseButton name="times" tip="Close" onClick={onClick} />;
}
