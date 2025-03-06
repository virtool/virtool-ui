import { BoxGroupSection, Circle } from "@base";
import Badge from "@base/Badge";
import * as Checkbox from "@radix-ui/react-checkbox";
import React from "react";
import styled from "styled-components";

const StateButtonCheckbox = styled(Checkbox.Root)`
    align-items: center;
    all: unset;
    background-color: ${(props) => props.theme.color.greyLightest};
    border: 2px solid ${(props) => props.theme.color.grey};
    border-radius: 4px;
    display: flex;
    justify-content: center;
    width: 18px;
    height: 18px;
`;

const StateButtonIndicator = styled(Checkbox.Indicator)`
    color: ${(props) => props.theme.color.greyDarkest};
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
`;

type StateButtonProps = {
    /** Whether the state is selected */
    active: boolean;
    /** The number of jobs associated with the state */
    count: number;
    /** The state color */
    color: string;
    /** The name of the state */
    label: string;
    /** A callback function to handle the state selection */
    onClick: () => void;
};

/**
 * A condensed job state item for use in a list of job states
 */
export function StateButton({
    active,
    count = 0,
    color,
    label,
    onClick,
}: StateButtonProps) {
    return (
        <StyledStateButton active={active} onClick={onClick}>
            <StateButtonCheckbox checked={active}>
                <StateButtonIndicator>
                    <i className="fas fa-check" />
                </StateButtonIndicator>
            </StateButtonCheckbox>

            <Circle color={color} />
            {label}
            <Badge className="ml-auto">{count}</Badge>
        </StyledStateButton>
    );
}
