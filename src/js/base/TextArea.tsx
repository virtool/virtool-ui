import React from "react";
import styled from "styled-components";
import { Input } from "./Input";

const StyledTextArea = styled(Input)`
    height: 220px;
    resize: vertical;
    overflow-y: scroll;
`;

export function TextArea(props) {
    return <StyledTextArea as="textarea" {...props} />;
}
