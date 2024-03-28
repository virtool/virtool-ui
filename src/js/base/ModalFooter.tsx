import React from "react";
import styled from "styled-components";
import { BoxGroupSection } from "./BoxGroupSection";

export const ModalFooter = styled(({ modalStyle, ...rest }) => <BoxGroupSection {...rest} />)`
    border-top: ${props => (props.modalStyle === "danger" ? "none" : "")};
    justify-content: end;
    text-align: right;
`;

ModalFooter.displayName = "ModalFooter";
