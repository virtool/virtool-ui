import { cn } from "@app/utils";
import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

const DropdownMenuItem = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof DropdownMenu.Item>
>(function DropdownMenuItem({ className, ...props }, ref) {
	return (
		<DropdownMenu.Item
			ref={ref}
			className={cn(
				"text-black cursor-pointer min-w-40 px-4 py-2.5 hover:bg-gray-50 hover:text-black",
				className,
			)}
			{...props}
		/>
	);
});

export default DropdownMenuItem;
