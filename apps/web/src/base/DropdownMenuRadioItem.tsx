import { Circle } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import {
	type DropdownMenuItemColor,
	getDropdownMenuItemClassName,
} from "./dropdownMenuItemStyles";

type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<
	typeof DropdownMenu.RadioItem
> & {
	color?: DropdownMenuItemColor;
};

const DropdownMenuRadioItem = forwardRef<
	HTMLDivElement,
	DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem(
	{ children, className, color = "gray", ...props },
	ref,
) {
	return (
		<DropdownMenu.RadioItem
			ref={ref}
			className={getDropdownMenuItemClassName(color, className)}
			{...props}
		>
			<span className="flex items-center justify-center shrink-0 size-4">
				<DropdownMenu.ItemIndicator>
					<Circle className="fill-current size-2" />
				</DropdownMenu.ItemIndicator>
			</span>
			{children}
		</DropdownMenu.RadioItem>
	);
});

export default DropdownMenuRadioItem;
