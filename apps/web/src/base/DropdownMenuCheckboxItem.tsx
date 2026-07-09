import { cn } from "@app/utils";
import { Check } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

const DropdownMenuCheckboxItem = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof DropdownMenu.CheckboxItem>
>(function DropdownMenuCheckboxItem({ children, className, ...props }, ref) {
	return (
		<DropdownMenu.CheckboxItem
			ref={ref}
			className={cn(
				"cursor-pointer flex gap-2.5 items-center min-w-40 px-4 py-2 text-black hover:bg-gray-50",
				className,
			)}
			{...props}
		>
			<span
				className={cn(
					"border-2 flex items-center justify-center rounded shrink-0 size-4",
					props.checked
						? "bg-blue-600 border-blue-600 text-white"
						: "border-gray-300",
				)}
			>
				<DropdownMenu.ItemIndicator>
					<Check size={12} strokeWidth={3} />
				</DropdownMenu.ItemIndicator>
			</span>
			{children}
		</DropdownMenu.CheckboxItem>
	);
});

export default DropdownMenuCheckboxItem;
