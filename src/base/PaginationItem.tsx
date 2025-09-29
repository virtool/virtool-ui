import { cn } from "@app/utils";
import { ComponentProps, forwardRef } from "react";

const PaginationItem = forwardRef<HTMLLIElement, ComponentProps<"li">>(
    ({ className, ...props }, ref) => (
        <li ref={ref} className={cn("m-1.5", className)} {...props} />
    ),
);

PaginationItem.displayName = "PaginationItem";

export default PaginationItem;
