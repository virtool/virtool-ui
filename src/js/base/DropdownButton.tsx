import { DropdownMenuTrigger } from "@base/DropdownMenuTrigger";
import React from "react";
import { StyledButton } from "./styled/StyledButton";

type DropdownButtonProps = {
    children: React.ReactNode;
    className?: string;
};

export function DropdownButton({ children, className }: DropdownButtonProps) {
    return (
        <DropdownMenuTrigger className={className}>
            <StyledButton>{children}</StyledButton>
        </DropdownMenuTrigger>
    );
}
