import { cn } from "@app/utils";
import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

const DropdownMenuSeparator = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof DropdownMenu.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
	return (
		<DropdownMenu.Separator
			ref={ref}
			className={cn("-mx-1 bg-gray-200 h-px my-1", className)}
			{...props}
		/>
	);
});

export default DropdownMenuSeparator;
