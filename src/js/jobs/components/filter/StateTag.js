import { reduce } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { getColor, getRing } from "../../../app/theme";
import { Badge } from "../../../base";

const StateTagContainer = styled.span`
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    
    ${props => props.active && `border-color: ${props.theme.color.blue};`};
    box-shadow: ${props => (props.active ? getRing("blueLight")(props) : "none")};
    
    text-transform: capitalize;
    background-color: white;
    border: 1px solid #cbd5e0;
    border-radius 10px;
    padding: 3px 7px;
    
    
     span {
        margin-left: 5px;
     }
`;

const Accent = styled.div`
    width: 7px;
    height: 7px;
    background-color: ${getColor};
    margin: 0 5px;
    border-radius: 3.5px;
`;

export const getAccentColor = name => {
    switch (name) {
        case "error":
        case "failed":
        case "terminated":
            return "red";

        case "waiting":
        case "preparing":
            return "grey";
        case "running":
            return "blue";

        case "complete":
            return "green";

        default:
            return "transparent";
    }
};

export const StateTag = ({ counts, name, active, onClick }) => {
    const count = reduce(counts, (result, value) => result + value, 0);
    return (
        <StateTagContainer onClick={onClick} active={active}>
            <Accent color={getAccentColor(name)} />
            {name} <Badge>{count}</Badge>
        </StateTagContainer>
    );
};
