import { DropdownMenuItem } from "@base/DropdownMenuItem";
import { Link } from "@base/index";
import React from "react";

type DropdownMenuLinkProps = {
    children: React.ReactNode;
    className?: string;
    to: string;
    target?: string;
    rel?: string;
};

export function DropdownMenuLink({
    children,
    className,
    to,
    target,
    rel,
}: DropdownMenuLinkProps) {
    return (
        <DropdownMenuItem className={className} asChild>
            <Link to={to} target={target} rel={rel}>
                {children}
            </Link>
        </DropdownMenuItem>
    );
}
