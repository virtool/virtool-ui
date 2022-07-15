import React from "react";
import styled from "styled-components";
import { Input } from "./Input";
import { Icon } from "./Icon";

const SearchbarContainer = styled.div`
    display: flex;
    position: relative;
    width: 100%;
    padding: 10px;
`;

const SearchbarClearIcon = styled(Icon)`
    position: absolute;
    padding-top: 12px;
    right: 20px;
`;

export const FilterBar = ({ term, setTerm, type, autoFocus }) => (
    <SearchbarContainer>
        <Input
            value={term}
            placeholder={`Filter ${type}`}
            aria-label={`Filter ${type}`}
            onChange={e => setTerm(e.target.value)}
            autoFocus={autoFocus}
        />

        <SearchbarClearIcon name="times fa-fw" onClick={() => setTerm("")} aria-label="clear" />
    </SearchbarContainer>
);
