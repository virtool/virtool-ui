import React from "react";
import styled from "styled-components";
import IconButton from "./IconButton";

const StyledCloseButton = styled(IconButton)`
    color: inherit;
`;

type CloseButtonProps = {
    onClick: () => void;
};

export default function CloseButton({ onClick }: CloseButtonProps) {
    return <StyledCloseButton name="times" tip="close" onClick={onClick} />;
}
