import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { BoxGroupSection } from "./BoxGroupSection";
import { Icon } from "./Icon";
import { noneFoundStyle } from "./noneFoundStyle";

const StyledNoneFoundSection = styled(BoxGroupSection)`
    ${noneFoundStyle}
    justify-content: center;
`;

export function NoneFoundSection({ children, noun }) {
    let childrenContainer;

    if (children) {
        childrenContainer = <span>. {children}.</span>;
    }

    return (
        <StyledNoneFoundSection>
            <Icon name="info-circle" /> No {noun} found{childrenContainer}
        </StyledNoneFoundSection>
    );
}

NoneFoundSection.propTypes = {
    children: PropTypes.node,
    noun: PropTypes.string.isRequired
};
