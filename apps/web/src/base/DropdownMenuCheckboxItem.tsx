import { cn } from "@app/utils";
import { Check, Minus } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import {
	type DropdownMenuItemColor,
	getDropdownMenuItemClassName,
} from "./dropdownMenuItemStyles";

type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<
	typeof DropdownMenu.CheckboxItem
> & {
	color?: DropdownMenuItemColor;
};

const DropdownMenuCheckboxItem = forwardRef<
	HTMLDivElement,
	DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem(
	{ checked, children, className, color = "gray", ...props },
	ref,
) {
	const isIndeterminate = checked === "indeterminate";

	return (
		<DropdownMenu.CheckboxItem
			ref={ref}
			checked={checked}
			className={getDropdownMenuItemClassName(color, className)}
			{...props}
		>
			<span
				className={cn(
					"border-2 flex items-center justify-center rounded shrink-0 size-4",
					checked === false
						? "border-gray-300"
						: "bg-blue-600 border-blue-600 text-white",
				)}
			>
				<DropdownMenu.ItemIndicator>
					{isIndeterminate ? (
						<Minus className="size-3" strokeWidth={3} />
					) : (
						<Check className="size-3" strokeWidth={3} />
					)}
				</DropdownMenu.ItemIndicator>
			</span>
			{children}
		</DropdownMenu.CheckboxItem>
	);
});

export default DropdownMenuCheckboxItem;
