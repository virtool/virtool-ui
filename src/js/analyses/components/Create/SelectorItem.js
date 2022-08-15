import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { BoxGroupSection, Label } from "../../../base";

const StyledSelectorItem = styled(BoxGroupSection)`
    align-items: center;
    background-color: white;
    display: flex;
    user-select: none;
    justify-content: space-between;
`;

export const SelectorItem = ({ children, className, onClick, isDefault }) => (
    <StyledSelectorItem as={onClick ? "button" : "div"} className={className} onClick={onClick}>
        {children}
        {isDefault ? <Label>Default</Label> : null}
    </StyledSelectorItem>
);

SelectorItem.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    isDefault: PropTypes.bool
};
