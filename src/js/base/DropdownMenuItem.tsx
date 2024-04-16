import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";
import { DropdownItemMixin } from "./DropdownItemMixin";

export const DropdownMenuItem = styled(DropdownMenu.Item)`
    ${DropdownItemMixin}
`;
