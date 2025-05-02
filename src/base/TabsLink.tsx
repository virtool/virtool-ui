import { useMatchPartialPath } from "../app/hooks";
import { cn } from "../app/utils";
import React from "react";
import { Link } from "wouter";

type TabsLinkProps = {
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
    to: string;
};

/**
 * A navigation link with active state styling
 */
export default function TabsLink({
    children,
    className,
    isActive,
    to,
}: TabsLinkProps) {
    isActive = useMatchPartialPath(to) || isActive;

    const classname = cn(
        "text-lg",
        "text-center",
        "font-medium",
        "py-2.5",
        "px-4",
        "-mb-[1px]",
        "hover:border-b-2",
        "hover:border-b-gray-400",
        className,
    );

    return (
        <Link
            className={
                isActive
                    ? cn(
                          classname,
                          "border-b-2",
                          "border-b-teal-700",
                          "hover:border-b-teal-700",
                      )
                    : classname
            }
            to={to}
        >
            {children}
        </Link>
    );
}
