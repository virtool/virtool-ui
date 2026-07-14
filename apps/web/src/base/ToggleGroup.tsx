import { cn } from "@app/cn";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import type { ReactNode } from "react";

type ToggleGroupProps = {
	"aria-labelledby"?: string;
	children: ReactNode;
	className?: string;
	onValueChange: (value: string) => void;
	value: string;
};

export default function ToggleGroup({
	"aria-labelledby": ariaLabelledby,
	children,
	className,
	onValueChange,
	value,
}: ToggleGroupProps) {
	function handleValueChange(value: string) {
		if (value) {
			onValueChange(value);
		}
	}

	return (
		<ToggleGroupPrimitive.Root
			aria-labelledby={ariaLabelledby}
			className={cn("inline-flex", className)}
			onValueChange={handleValueChange}
			type="single"
			value={value}
		>
			{children}
		</ToggleGroupPrimitive.Root>
	);
}
