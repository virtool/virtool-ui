import { cn } from "@app/utils";
import * as React from "react";

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("m-1.5", className)} {...props} />
));

PaginationItem.displayName = "PaginationItem";

export default PaginationItem;
