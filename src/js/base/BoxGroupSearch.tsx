import React from "react";
import styled from "styled-components";
import { BoxGroupSection } from "./BoxGroupSection";
import { Icon } from "./Icon";
import { Input } from "./Input";

const BoxGroupSearchIconContainer = styled.div`
    align-items: center;
    display: flex;
    margin-top: 10px;
    position: absolute;
    right: 20px;
`;

const StyledBoxGroupSearch = styled(BoxGroupSection)`
    display: flex;
    padding: 10px;
    position: relative;
`;

type BoxGroupSearchProps = {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    autoFocus?: boolean;
};

export function BoxGroupSearch({ label, placeholder = "", value, onChange, autoFocus = false }: BoxGroupSearchProps) {
    return (
        <StyledBoxGroupSearch>
            <Input
                value={value}
                placeholder={placeholder}
                aria-label={label}
                onChange={e => onChange(e.target.value)}
                autoFocus={autoFocus}
            />
            <BoxGroupSearchIconContainer>
                <Icon name="times fa-fw" onClick={() => onChange("")} aria-label="clear" />
            </BoxGroupSearchIconContainer>
        </StyledBoxGroupSearch>
    );
}
