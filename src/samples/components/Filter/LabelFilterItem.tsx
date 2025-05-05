import React from "react";
import styled from "styled-components";
import { getRing } from "../../../app/theme";
import Icon from "../../../base/Icon";
import { BaseSampleLabel } from "../Label/BaseSampleLabel";

type StyledLabelFilterItemProps = {
    pressed?: boolean;
    theme: object;
};

const StyledLabelFilterItem = styled(
    BaseSampleLabel,
)<StyledLabelFilterItemProps>`
    ${(props) => props.pressed && `border-color: ${props.theme.color.blue};`};
    box-shadow: ${(props) => (props.pressed ? getRing("blueLight")(props) : "none")};
    cursor: pointer;
    margin: 4px 0; 
  
      &:not(:last-child) {
        margin-right: 8px;
      }

    &:focus {
        border-color: ${(props) => props.theme.color.blueLight}
        outline: none;
    }
`;

export default function LabelFilterItem({ color, id, name, pressed, onClick }) {
    return (
        <StyledLabelFilterItem
            as="button"
            aria-pressed={pressed}
            color={color}
            pressed={pressed}
            onClick={() => onClick(id)}
        >
            <Icon name="circle" />
            {name}
        </StyledLabelFilterItem>
    );
}
