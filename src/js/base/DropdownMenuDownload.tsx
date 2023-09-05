import { MenuLink } from "@reach/menu-button";
import React from "react";
import styled from "styled-components";
import { DropdownItemMixin } from "./DropdownItemMixin";

export const DropdownMenuDownload = styled(({ children, href }) => (
    <MenuLink href={href} download>
        {children}
    </MenuLink>
))`
    ${DropdownItemMixin}
`;

DropdownMenuDownload.displayName = "DropdownMenuDownload";
