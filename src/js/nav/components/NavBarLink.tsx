import { useMatchPartialPath } from "@/hooks";
import { cn } from "@/utils";
import React from "react";
import { Link } from "wouter";

const className = cn(
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

const activeClassName = cn(className, "bg-teal-800", "hover:text-white");

export function NavBarLink({ children, to }) {
    const active = useMatchPartialPath(to);

    return (
        <Link to={to} className={() => (active ? activeClassName : className)}>
            {children}
        </Link>
    );
}
