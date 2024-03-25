import { DropdownMenuItem } from "@base/DropdownMenuItem";
import React from "react";
import { Link } from "react-router-dom";

export function DropdownMenuLink({ children, className, to, target, rel }) {
    return (
        <DropdownMenuItem className={className} asChild>
            <Link to={to} target={target} rel={rel}>
                {children}
            </Link>
        </DropdownMenuItem>
    );
}
