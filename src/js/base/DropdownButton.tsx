import { StyledButton } from "./styled/StyledButton";
import { MenuButton } from "@reach/menu-button";
import React from "react";

type DropdownButtonProps = {
    children: React.ReactNode;
};

export const DropdownButton = ({ children }: DropdownButtonProps) => (
    <StyledButton as={MenuButton}>{children}</StyledButton>
);
