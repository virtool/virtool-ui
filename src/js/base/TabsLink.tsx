import { cn } from "@utils/utils";
import React from "react";
import { NavLink } from "react-router-dom";

type TabsLinkProps = {
    children: React.ReactNode;
    className?: string;
    isActive?: () => boolean;
    to: string | object;
};

/**
 * A navigation link with active state styling
 */
export function TabsLink({ children, className, isActive, to }: TabsLinkProps) {
    return (
        <NavLink
            className={cn(
                "text-lg",
                "text-center",
                "font-medium",
                "py-2.5",
                "px-4",
                "-mb-[1px]",
                "hover:border-b-2",
                "hover:border-b-gray-400",
                className,
            )}
            isActive={isActive}
            activeClassName={cn("border-b-2", "border-b-teal-700", "hover:border-b-teal-700")}
            to={to}
        >
            {children}
        </NavLink>
    );
}
