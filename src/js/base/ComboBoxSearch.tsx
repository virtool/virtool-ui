import React from "react";
import styled from "styled-components";
import { InputSearch } from "./InputSearch";

const InputSearchContainer = styled.div`
    margin: 10px 5px;
`;

export const ComboBoxSearch = ({ getInputProps }) => (
    <InputSearchContainer>
        <InputSearch {...getInputProps()} />
    </InputSearchContainer>
);
