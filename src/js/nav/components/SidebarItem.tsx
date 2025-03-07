import { useMatchPartialPath } from "@/hooks";
import { cn } from "@/utils";
import { Link } from "@base";
import Icon from "@base/Icon";
import React from "react";

type SidebarItemProps = {
    /** A list of routes to exclude from the sidebar */
    exclude?: string[];
    icon: string;
    link: string;
    title: string;
};

const baseClassName = cn(
    "text-gray-500",
    "cursor-pointer",
    "pb-5",
    "text-center",
    "w-full",
    "hover:text-gray-700",
);

/**
 * Displays a styled sidebar item for use in the sidebar component
 */
export default function SidebarItem({
    icon,
    link,
    title,
    exclude,
}: SidebarItemProps) {
    const isActive = useMatchPartialPath(link, exclude);

    const activeClassName = cn(
        baseClassName,
        "text-primary",
        "font-medium",
        "hover:text-primary",
        "focus:text-primary",
    );

    return (
        <Link
            to={link}
            className={(active) =>
                active || isActive ? activeClassName : baseClassName
            }
        >
            <Icon name={icon} className="text-lg" />
            <p className="block text-md my-2">{title}</p>
        </Link>
    );
}
