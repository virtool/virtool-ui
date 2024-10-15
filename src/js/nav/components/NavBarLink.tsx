import { cn } from "@utils/utils";
import React from "react";
import { Link } from "@base";

const navBarkLinkClassName = cn(
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
    return (
        <Link
            to={to}
            className={active =>
                active
                    ? cn(navBarkLinkClassName, "text-white", "bg-primary-dark", "hover:text-white")
                    : navBarkLinkClassName
            }
        >
            {children}
        </Link>
    );
}
