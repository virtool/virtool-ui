import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import Button from "./Button";

type DropdownButtonProps = {
    children: React.ReactNode;
    className?: string;
};

export default function DropdownButton({
    children,
    className,
}: DropdownButtonProps) {
    return (
        <Button as={DropdownMenu.Trigger} className={className}>
            {children}
        </Button>
    );
}
