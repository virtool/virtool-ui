import React from "react";
import styled from "styled-components";
import { Input } from "./Input";

const StyledTextArea = styled(Input)`
    height: 220px;
    resize: vertical;
    overflow-y: scroll;
`;

interface InputProps {
    "aria-label"?: string;
    as?: React.ElementType;
    children?: React.ReactNode;
    className?: string;
    error?: string;
    id?: string;
    name?: string;
    readOnly?: boolean;
    value?: string | number;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextArea = React.forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => {
        return <StyledTextArea as="textarea" {...props} ref={ref} />;
    },
);
