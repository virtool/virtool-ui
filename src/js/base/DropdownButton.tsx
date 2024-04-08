import { DropdownMenuTrigger } from "@base/DropdownMenuTrigger";
import React from "react";
import { StyledButton } from "./styled/StyledButton";

type DropdownButtonProps = {
    children: React.ReactNode;
};

export function DropdownButton({ children }: DropdownButtonProps) {
    return (
        <DropdownMenuTrigger>
            <StyledButton>{children}</StyledButton>
        </DropdownMenuTrigger>
    );
}
