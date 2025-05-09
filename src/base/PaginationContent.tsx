import { cn } from "@app/utils";
import * as React from "react";

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
));

PaginationContent.displayName = "PaginationContent";

export default PaginationContent;
