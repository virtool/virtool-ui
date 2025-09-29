import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";
import Button from "./Button";

type DropdownButtonProps = {
    children: ReactNode;
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
