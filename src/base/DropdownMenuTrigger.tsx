import { cn } from "@app/utils";
import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

const DropdownMenuTrigger = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<typeof DropdownMenu.Trigger>
>(function DropdownMenuTrigger({ className, ...props }, ref) {
	return (
		<DropdownMenu.Trigger
			ref={ref}
			className={cn(
				"flex cursor-pointer appearance-none border-none bg-transparent p-0",
				className,
			)}
			{...props}
		/>
	);
});

export default DropdownMenuTrigger;
