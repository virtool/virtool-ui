import React from "react";
import styled from "styled-components";
import {
    borderRadius,
    getBorder,
    getColor,
    getFontWeight,
} from "../../app/theme";
import { Icon } from "../Icon";

const StyledTriggerButton = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    background-color: ${({ theme }) => getColor({ color: "white", theme })};
    border: ${getBorder};
    border-radius: ${borderRadius.sm};
    font-weight: ${getFontWeight("thick")};
    text-transform: capitalize;
    width: 100%;
    i.fas {
        margin-left: 5px;
    }
`;
export const ComboboxTriggerButton = ({
    TriggerButtonProps,
    selectedItem,
    renderRow,
    id,
}) => {
    return (
        <StyledTriggerButton {...TriggerButtonProps} id={id} type="button">
            {selectedItem ? renderRow(selectedItem) : "Select user"}
            <Icon name="chevron-down" />
        </StyledTriggerButton>
    );
};
