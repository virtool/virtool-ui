import React from "react";
import styled from "styled-components";
import { BoxGroupSection } from "./BoxGroupSection";

export const DialogFooter = styled(({ dialogStyle, ...rest }) => <BoxGroupSection {...rest} />)`
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-top: ${props => (props.dialogStyle === "danger" ? "none" : "")};
    justify-content: end;
    text-align: right;
    overflow-y: auto;
`;
