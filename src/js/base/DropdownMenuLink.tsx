import { MenuLink } from "@reach/menu-button";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { DropdownItemMixin } from "./DropdownItemMixin";

export const DropdownMenuLink = styled(({ children, className, to, target, rel }) => (
    <MenuLink as={Link} className={className} to={to} target={target} rel={rel}>
        {children}
    </MenuLink>
))`
    ${DropdownItemMixin}
`;

DropdownMenuLink.displayName = "DropdownMenuLink";
