import { DialogContent as ReachDialogContent } from "@reach/dialog";
import React from "react";
import styled, { keyframes } from "styled-components";

const modalContentOpen = keyframes`
    100% {
        transform: translate(0,100px);
    }
`;

const modalContentClose = keyframes`
    0% {
        transform: translate(0,100px);
    }
    100% {
        opacity: 0;
    }
`;

export const ModalContent = styled(({ close, size, ...rest }) => <ReachDialogContent {...rest} />)`
    animation: ${props => (props.close ? modalContentClose : modalContentOpen)} 0.3s;
    animation-fill-mode: forwards;
    background: white;
    border-radius: ${props => props.theme.borderRadius.md};
    box-shadow: ${props => props.theme.boxShadow.lg};
    margin: -70px auto;
    overflow: hidden;
    padding: 0;
    position: relative;
    width: ${props => (props.size === "lg" ? "900px" : "600px")};
    z-index: 110;

    @media (max-width: 991px) {
        width: 600px;
    }
`;

ModalContent.displayName = "ModalContent";
