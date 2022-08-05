import React from "react";
import styled from "styled-components";
import { BoxGroupSection } from "./Box";
import { Icon } from "./Icon";
import { Input } from "./Input";

const IconContainer = styled.div`
align-items: center;
display: flex;
    margin-top: 10px;
    position: absolute;
    right 20px;
`;

const StyledBoxGroupSearch = styled(BoxGroupSection)`
    display: flex;
    padding: 10px;
    position: relative;
`;

export const BoxGroupSearch = ({ label, placeholder, value, onChange, autoFocus = false }) => (
    <StyledBoxGroupSearch>
        <Input
            value={value}
            placeholder={placeholder}
            aria-label={label}
            onChange={e => onChange(e.target.value)}
            autoFocus={autoFocus}
        />
        <IconContainer>
            <Icon name="times fa-fw" onClick={() => onChange("")} aria-label="clear" />
        </IconContainer>
    </StyledBoxGroupSearch>
);
