import { cn } from "@app/utils";
import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

const DropdownMenuLabel = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof DropdownMenu.Label>
>(function DropdownMenuLabel({ className, ...props }, ref) {
	return (
		<DropdownMenu.Label
			ref={ref}
			className={cn(
				"font-medium px-2 py-1.5 text-gray-500 text-xs tracking-wide uppercase",
				className,
			)}
			{...props}
		/>
	);
});

export default DropdownMenuLabel;
