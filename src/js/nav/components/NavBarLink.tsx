import { cn } from "@utils/utils";
import React from "react";
import { Link } from "@base";
import { useMatchPartialPath } from "@utils/hooks";

const navBarLinkClassName = cn(
    "text-white",
    "cursor-pointer",
    "flex",
    "text-lg",
    "h-full",
    "justify-center",
    "items-center",
    "px-5",
    "hover:text-primary-darkest",
);

export function NavBarLink({ children, to }) {
    const isActive = useMatchPartialPath(to);
    return (
        <Link
            to={to}
            className={active =>
                isActive || active
                    ? cn(navBarLinkClassName, "text-white", "bg-primary-dark", "hover:text-white", "focus:text-white")
                    : navBarLinkClassName
            }
        >
            {children}
        </Link>
    );
}
