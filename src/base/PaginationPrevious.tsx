import { cn } from "@app/utils";
import * as React from "react";
import PaginationLink from "./PaginationLink";

type PaginationPreviousProps = {
    active?: boolean;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    to: string;
};

/**
 * A styled previous button link for use in a pagination component
 */
export default function PaginationPrevious({
    active,
    className,
    disabled,
    onClick,
    to,
}: PaginationPreviousProps) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            className={cn("gap-1 pl-2.5", className)}
            active={active}
            disabled={disabled}
            onClick={onClick}
            to={to}
        >
            Previous
        </PaginationLink>
    );
}
