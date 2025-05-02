import Button from "./Button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";

type DropdownButtonProps = {
    children: React.ReactNode;
};

export default function DropdownButton({ children }: DropdownButtonProps) {
    return <Button as={DropdownMenu.Trigger}>{children}</Button>;
}
