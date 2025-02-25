import { cn } from "@utils/utils";
import * as React from "react";

export const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("m-1.5", className)} {...props} />
));
