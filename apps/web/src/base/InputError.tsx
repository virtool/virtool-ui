import type { ReactNode } from "react";
import { cn } from "@/app/utils";

type InputErrorProps = {
	children: ReactNode;
	className?: string;
};

function InputError({ children, className }: InputErrorProps) {
	return (
		<p
			className={cn(
				"text-red-600 text-sm font-medium mt-1 -mb-2.5 min-h-5 text-right",
				className,
			)}
		>
			{children}
		</p>
	);
}

InputError.displayName = "InputError";

export default InputError;
