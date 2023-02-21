import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../app/theme";

export const TabsLink = styled(NavLink)`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    margin-bottom: -1px;
    padding: 10px 12px;
    text-align: center;

    &.active {
        border-bottom: 1px solid ${props => props.theme.color.primary};
        box-shadow: inset 0 -1px 0 0 ${props => props.theme.color.primary};
    }

    &:not(.active):hover {
        border-bottom: 1px solid ${props => props.theme.color.grey};
        box-shadow: inset 0 -1px 0 0 ${props => props.theme.color.grey};
    }
`;

TabsLink.displayName = "TabsLink";
