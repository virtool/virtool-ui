import { IconButton } from "@base/IconButton";
import React from "react";
import styled from "styled-components";

const StyledCloseButton = styled(IconButton)`
    color: inherit;
`;

type CloseButtonProps = {
    onClick: () => void;
};

export default function CloseButton({ onClick }: CloseButtonProps) {
    return <StyledCloseButton name="times" tip="close" onClick={onClick} />;
}
