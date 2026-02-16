import { cn } from "@app/utils";
import React from "react";

export interface InputSimpleProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const InputSimple = React.forwardRef<HTMLInputElement, InputSimpleProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "bg-white border border-gray-300 rounded-[3px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] block text-sm h-auto outline-none py-2 px-2.5 relative transition-all duration-150 ease-in-out w-full",
                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50",
                    "read-only:bg-gray-100",
                    className,
                )}
                {...props}
            />
        );
    },
);

InputSimple.displayName = "InputSimple";

export default InputSimple;
