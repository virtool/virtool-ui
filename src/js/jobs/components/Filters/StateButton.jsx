import * as Checkbox from "@radix-ui/react-checkbox";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { Badge, BoxGroupSection, Circle } from "../../../base";

const StateButtonCheckbox = styled(Checkbox.Root)`
    align-items: center;
    all: unset;
    background-color: ${props => props.theme.color.greyLightest};
    border: 2px solid ${props => props.theme.color.grey};
    border-radius: 4px;
    display: flex;
    justify-content: center;
    width: 18px;
    height: 18px;
`;

const StateButtonIndicator = styled(Checkbox.Indicator)`
    color: ${props => props.theme.color.greyDarkest};
`;

const StyledStateButton = styled(BoxGroupSection)`
    align-items: center;
    border-bottom: none;
    color: black;
    cursor: pointer;
    display: flex;
    gap: 10px;
    position: relative;
    text-transform: capitalize;
    user-select: none;

    ${Badge} {
        margin-left: auto;
    }
`;

export const StateButton = ({ active, count = 0, color, label, onClick }) => (
    <StyledStateButton active={active} onClick={onClick}>
        <StateButtonCheckbox label={label} checked={active}>
            <StateButtonIndicator>
                <i className="fas fa-check" />
            </StateButtonIndicator>
        </StateButtonCheckbox>

        <Circle color={color} />
        {label}
        <Badge>{count}</Badge>
    </StyledStateButton>
);

StateButton.propTypes = {
    active: PropTypes.bool,
    color: PropTypes.string.isRequired,
    count: PropTypes.number,
    state: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};
