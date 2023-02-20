import React from "react";
import styled from "styled-components/macro";
import { InputContext } from "./InputContext";

export const StyledInputGroup = styled.div`
    margin: 0 0 15px;
    padding-bottom: 10px;
`;

type InputGroupProps = {
    children: React.ReactNode;
    className?: string;
    error?: string;
};

export const InputGroup = ({ children, className, error }: InputGroupProps) => (
    <InputContext.Provider value={error}>
        <StyledInputGroup className={className}>{children}</StyledInputGroup>
    </InputContext.Provider>
);
