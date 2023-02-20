import React from "react";
import styled from "styled-components/macro";
import { BoxGroupSection } from "./BoxGroupSection";

export const ModalFooter = styled(({ modalStyle, ...rest }) => <BoxGroupSection {...rest} />)`
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-top: ${props => (props.modalStyle === "danger" ? "none" : "")};
    justify-content: end;
    text-align: right;
    overflow-y: auto;
`;
