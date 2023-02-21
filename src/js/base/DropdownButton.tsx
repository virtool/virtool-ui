import { MenuButton } from "@reach/menu-button";
import React from "react";
import { StyledButton } from "./styled/StyledButton";

type DropdownButtonProps = {
    children: React.ReactNode;
};

export const DropdownButton = ({ children }: DropdownButtonProps) => (
    <StyledButton as={MenuButton}>{children}</StyledButton>
);

DropdownButton.displayName = "DropdownButton";
