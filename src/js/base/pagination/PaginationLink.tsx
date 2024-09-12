import { PaginationItem } from "@base/pagination/PaginationItem";
import { cn } from "@utils/utils";
import * as React from "react";
import { Link } from "react-router-dom";

type PaginationLinkProps = {
    active?: boolean;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    to: string;
};

/**
 * A styled pagination link navigation users to specified page number
 */
export function PaginationLink({ active, children, className, disabled, onClick, to }: PaginationLinkProps) {
    return (
        <PaginationItem>
            <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                    "text-lg",
                    "text-blue-500",
                    { "text-blue-900": !active, "pointer-events-none": disabled },

                    className,
                )}
                to={to}
                onClick={onClick}
            >
                {children}
            </Link>
        </PaginationItem>
    );
}
