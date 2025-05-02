import { useMatchPartialPath } from "../../app/hooks";
import { cn } from "../../app/utils";
import React from "react";
import { Link } from "wouter";

const baseClassName = cn(
    "flex",
    "font-medium",
    "h-full",
    "hover:text-primary-darkest",
    "items-center",
    "justify-center",
    "px-5",
    "text-lg",
    "text-white",
);

const activeClassName = cn(baseClassName, "bg-teal-800", "hover:text-white");

export function NavLink({ children, to }) {
    const active = useMatchPartialPath(to);

    return (
        <Link
            to={to}
            className={() => (active ? activeClassName : baseClassName)}
        >
            {children}
        </Link>
    );
}
