import { getFontSize, getFontWeight } from "@app/theme";
import { Icon } from "@base";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { excludePaths } from "../utils";

const StyledSidebarItem = styled(NavLink)`
    color: ${props => props.theme.color.greyDark};
    cursor: pointer;
    padding-bottom: 1.4rem;
    text-align: center;
    width: 100%;

    &:hover {
        color: ${props => props.theme.color.greyDarkest};
    }

    &.active {
        color: ${props => props.theme.color.primary};
        font-weight: ${getFontWeight("thick")};
    }

    i {
        font-size: 16px;
    }

    p {
        display: block;
        font-size: ${getFontSize("md")};
        margin: 0.4rem 0;
    }
`;

type SidebarItemProps = {
    /** A list of routes to exclude from the sidebar */
    exclude?: string[];
    icon: string;
    link: string;
    title: string;
};

/**
 * Displays a styled sidebar item for use in the sidebar component
 */
export default function SidebarItem({ exclude, icon, link, title }: SidebarItemProps) {
    return (
        <StyledSidebarItem to={link} activeClassName="active" isActive={excludePaths(exclude)}>
            <Icon name={icon} />
            <p>{title}</p>
        </StyledSidebarItem>
    );
}
