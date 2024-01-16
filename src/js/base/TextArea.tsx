import React from "react";
import styled from "styled-components";
import { Input } from "./Input";

const StyledTextArea = styled(Input)`
    height: 220px;
    resize: vertical;
    overflow-y: scroll;
`;

export function TextArea({ register, name, ...props }) {
    return <StyledTextArea as="textarea" {...(register && register(name))} {...props} />;
}
