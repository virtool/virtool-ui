import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { BoxGroupSection, Label } from "../../../base";

const StyledSelectorItem = styled(BoxGroupSection)`
    align-items: center;
    background-color: white;
    display: flex;
    justify-content: space-between;
    user-select: none;

    span:first-child {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
`;

export const SelectorItem = ({ children, className, onClick, isDefault }) => (
    <StyledSelectorItem as={onClick ? "button" : "div"} className={className} onClick={onClick}>
        <span>{children}</span>
        {isDefault ? <Label>Default</Label> : null}
    </StyledSelectorItem>
);

SelectorItem.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    isDefault: PropTypes.bool
};
