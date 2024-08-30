import { cn } from "@utils/utils";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";
import { forwardRef } from "react";

/**
 * A styled group containing a command items
 */
export const CommandGroup = forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            "overflow-hidden",
            "p-1",
            "text-foreground",
            "[&_[cmdk-group-heading]]:px-2",
            "[&_[cmdk-group-heading]]:py-1.5",
            "[&_[cmdk-group-heading]]:text-xs",
            "[&_[cmdk-group-heading]]:font-medium",
            "[&_[cmdk-group-heading]]:text-muted-foreground",
            className
        )}
        {...props}
    />
));
