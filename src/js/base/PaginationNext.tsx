import { cn } from "@/utils";
import { LinkButton } from "@base/index";
import { PaginationItem } from "@base/PaginationItem";
import * as React from "react";

type PaginationNextProps = {
    className?: string;
    disabled?: boolean;
    to: string;
};

/**
 * A styled next button link for use in a pagination component
 */
export function PaginationNext({
    className,
    disabled,
    to,
}: PaginationNextProps) {
    return (
        <PaginationItem>
            <LinkButton
                aria-label="Go to next page"
                className={cn(
                    "flex",
                    "justify-center",
                    "w-18",
                    "text-white",
                    { "pointer-events-none": disabled },
                    className,
                )}
                to={to}
                color="blue"
            >
                Next
            </LinkButton>
        </PaginationItem>
    );
}
