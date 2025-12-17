import { cn } from "@app/utils";
import { DropdownMenu } from "radix-ui";
import { ReactNode } from "react";

type DropdownMenuContentProps = {
    children: ReactNode;
    className?: string;
};

/**
 * Displays the content of the dropdown menu to the users
 */
export default function DropdownMenuContent({
    children,
    className,
}: DropdownMenuContentProps) {
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
