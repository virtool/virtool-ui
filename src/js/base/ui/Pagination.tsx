import { LinkButton } from "@base";
import { cn } from "@utils/utils";
import { MoreHorizontal } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";

const PaginationRoot = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
);
PaginationRoot.displayName = "PaginationRoot";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
    ({ className, ...props }, ref) => (
        <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
    )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("m-1.5", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
    active?: boolean;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    to: string;
};

const PaginationLink = ({ active, children, className, disabled, onClick, to }: PaginationLinkProps) => (
    <PaginationItem>
        <Link
            aria-current={active ? "page" : undefined}
            className={cn(
                "text-lg",
                "text-blue-500",
                { "text-blue-900": !active, "pointer-events-none": disabled },

                className
            )}
            to={to}
            onClick={onClick}
        >
            {children}
        </Link>
    </PaginationItem>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink aria-label="Go to previous page" className={cn("gap-1 pl-2.5", className)} {...props}>
        Previous
    </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, disabled, to }: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationItem>
        <LinkButton
            aria-label="Go to next page"
            className={cn(
                "flex",
                "justify-center",
                "w-18",
                "text-white",
                { "pointer-events-none": disabled },
                className
            )}
            to={to}
            color="blue"
        >
            Next
        </LinkButton>
    </PaginationItem>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
    <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
    PaginationRoot,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
