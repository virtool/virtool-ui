import { DialogOverlay as ReachDialogOverlay } from "@reach/dialog";
import React from "react";
import styled, { keyframes } from "styled-components";

const modalOverlayOpen = keyframes`
    0% {
        opacity: 0;
    }
`;

const modalOverlayClose = keyframes`
    100% {
        opacity: 0;
    }
`;

export const ModalOverlay = styled(({ close, ...rest }) => <ReachDialogOverlay {...rest} />)`
    animation: ${props => (props.close ? modalOverlayClose : modalOverlayOpen)} 0.2s;
    animation-fill-mode: forwards;
    background: hsla(0, 0%, 0%, 0.33);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    z-index: 100;
`;
