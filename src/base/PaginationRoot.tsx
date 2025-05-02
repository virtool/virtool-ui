import { cn } from "../app/utils";
import * as React from "react";

type PaginationRootProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * A styled pagination root component
 */
export default function PaginationRoot({
    children,
    className,
}: PaginationRootProps) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
        >
            {children}
        </nav>
    );
}
