import { MenuItem } from "@reach/menu-button";
import styled from "styled-components";
import { DropdownItemMixin } from "./DropdownItemMixin";

export const DropdownMenuItem = styled(MenuItem)`
    ${DropdownItemMixin}
`;

DropdownMenuItem.displayName = "DropdownMenuItem";
