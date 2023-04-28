import React from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
    display: flex;
    margin: 10px 10px;
    justify-content: center;
    align-items: center;
`;

const SearchInput = styled.input`
    border: none;
    background-color: #f2f2f2;
    width: 100%;
    padding: 5px;
`;

export const SearchBar = ({ value, onChange, placeholder, options, children }) => {
    return (
        <SearchContainer>
            <SearchInput value={value} onChange={onChange} placeholder={placeholder} />
        </SearchContainer>
    );
};
