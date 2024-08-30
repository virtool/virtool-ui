import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";
import { forwardRef } from "react";

export const CommandEmpty = forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />);
