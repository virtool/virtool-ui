import { cn } from "@app/utils";
import React from "react";
import { inputBaseClasses, inputFocusClasses } from "./styles";

export interface InputSimpleProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	as?: string;
}

const InputSimple = React.forwardRef<HTMLInputElement, InputSimpleProps>(
	({ className, ...props }, ref) => {
		return (
			<input
				ref={ref}
				className={cn(
					inputBaseClasses,
					inputFocusClasses,
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
