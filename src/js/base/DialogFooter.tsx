import React from "react";
import styled from "styled-components";
import { BoxGroupSection, BoxGroupSectionProps } from "./BoxGroupSection";

type DialogFooterProps = BoxGroupSectionProps & {
    dialogStyle?: string;
};

export const DialogFooter = styled(({ dialogStyle, ...rest }) => <BoxGroupSection {...rest} />)<DialogFooterProps>`
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-top: ${props => (props.dialogStyle === "danger" ? "none" : "")};
    justify-content: end;
    text-align: right;
    overflow-y: auto;
`;
