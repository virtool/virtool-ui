import { useMatchPartialPath } from "@app/hooks";
import { cn } from "@app/utils";
import Icon from "@base/Icon";
import Link from "@base/Link";
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

const activeClassName = cn(
    baseClassName,
    "text-primary",
    "font-medium",
    "hover:text-primary",
    "focus:text-primary",
);

/**
 * Displays a styled sidebar item for use in the sidebar component
 */
export default function SidebarLink({
    icon,
    link,
    title,
    exclude,
}: SidebarItemProps) {
    const isActive = useMatchPartialPath(link, exclude);

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
