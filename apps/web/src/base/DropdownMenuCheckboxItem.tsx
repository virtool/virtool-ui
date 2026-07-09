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
	return (
		<DropdownMenu.CheckboxItem
			ref={ref}
			checked={checked}
			className={getDropdownMenuItemClassName(color, className)}
			{...props}
		>
			<span className="flex items-center justify-center shrink-0 size-4">
				<DropdownMenu.ItemIndicator>
					{checked === "indeterminate" ? (
						<Minus className="size-3.5" strokeWidth={3} />
					) : (
						<Check className="size-3.5" strokeWidth={3} />
					)}
				</DropdownMenu.ItemIndicator>
			</span>
			{children}
		</DropdownMenu.CheckboxItem>
	);
});

export default DropdownMenuCheckboxItem;
