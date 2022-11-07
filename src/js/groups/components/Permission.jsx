import React from "react";
import styled from "styled-components";
import { Checkbox, SelectBoxGroupSection } from "../../base";

const StyledGroupPermission = styled(SelectBoxGroupSection)`
    background-color: ${props => (props.active ? props.theme.color.blue : "white")};
    user-select: none;
`;

export const GroupPermission = ({ active, permission, onClick }) => (
    <StyledGroupPermission active={active} onClick={onClick}>
        <Checkbox checked={active} label={permission} />
    </StyledGroupPermission>
);
