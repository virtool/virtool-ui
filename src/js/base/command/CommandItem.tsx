import { cn } from "@utils/utils";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";
import { forwardRef } from "react";

export const CommandItem = forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            "relative hover:bg-gray-50 flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
            className
        )}
        {...props}
    />
));
