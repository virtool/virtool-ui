import { every, map } from "lodash-es";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { getFontWeight } from "../../../app/theme";
import { BoxGroup, BoxGroupSection } from "../../../base";
import { StateButton } from "./StateButton";

const StyledStateCategory = styled(BoxGroup)`
    background-color: ${props => props.theme.color.white};
    position: relative;
    width: 100%;
    z-index: 1;

    > ${BoxGroup} {
        border-bottom: none;
        border-top-right-radius: 0;
        border-bottom-left-radius: 0;
        border-right: none;
        margin: 40px 0 0 10px;
        z-index: 10;
    }

    > ${BoxGroupSection}:first-of-type {
        border-bottom: none;
    }
`;

const StateCategoryButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    font-weight: ${getFontWeight("thick")};
    margin: 0;
    padding: 10px 0 0 15px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;

    &:hover {
        background-color: ${props => props.theme.color.greyHover};
    }
`;
export const StateCategory = ({ states, label, onClick }) => (
    <StyledStateCategory>
        <StateCategoryButton
            active={every(states, { active: true })}
            tabIndex={0}
            onClick={() => onClick(label.toLowerCase())}
        >
            {label}
        </StateCategoryButton>
        <BoxGroup>
            {map(states, ({ active, color, count, state, label }) => (
                <StateButton
                    key={state}
                    active={active}
                    color={color}
                    count={count}
                    label={label}
                    onClick={() => onClick(state)}
                />
            ))}
        </BoxGroup>
    </StyledStateCategory>
);

StateCategory.propTypes = {
    states: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};
