import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@utils/utils";
import React from "react";

type DropdownMenuContentProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * Displays the content of the dropdown menu to the users
 */
export function DropdownMenuContent({ children, className }: DropdownMenuContentProps) {
    return (
        <DropdownMenu.Content
            className={cn(
                "animate-slideDown",
                "bg-white",
                "border",
                "border-gray-300",
                "rounded-md",
                "shadow-lg",
                "mx-2",
                "my-0",
                "flex",
                "flex-col",
                "text-base",
                "z-10",
                className,
            )}
        >
            {children}
        </DropdownMenu.Content>
    );
}
