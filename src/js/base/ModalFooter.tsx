import React from "react";
import styled from "styled-components";
import { BoxGroupSection, BoxGroupSectionProps } from "./BoxGroupSection";

type ModalFooterProps = BoxGroupSectionProps & {
    modalStyle?: string;
};

export const ModalFooter = styled(({ modalStyle, ...rest }) => <BoxGroupSection {...rest} />)<ModalFooterProps>`
    border-top: ${props => (props.modalStyle === "danger" ? "none" : "")};
    justify-content: end;
    text-align: right;
`;

ModalFooter.displayName = "ModalFooter";
