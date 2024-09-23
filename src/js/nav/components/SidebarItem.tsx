import { Icon } from "@base";
import { cn } from "@utils/utils";
import React from "react";
import styled from "styled-components";
import { Link } from "wouter";

const StyledSidebarItem = styled(Link)`
    color: ${props => props.theme.color.greyDark};
    cursor: pointer;
    padding-bottom: 1.4rem;
    text-align: center;
    width: 100%;
`;

type SidebarItemProps = {
    /** A list of routes to exclude from the sidebar */
    exclude?: string[];
    icon: string;
    link: string;
    title: string;
};

const baseClassName = cn("text-gray-500", "cursor-pointer", "pb-5", "text-center", "w-full", "hover:text-gray-700");

/**
 * Displays a styled sidebar item for use in the sidebar component
 */
export default function SidebarItem({ icon, link, title }: SidebarItemProps) {
    const activeClassName = cn(
        baseClassName,
        "text-primary",
        "font-medium",
        "hover:text-primary",
        "focus:text-primary"
    );

    return (
        <Link to={link} className={active => (active ? activeClassName : baseClassName)}>
            <Icon name={icon} className="text-lg" />
            <p className="block text-md my-2">{title}</p>
        </Link>
    );
}
