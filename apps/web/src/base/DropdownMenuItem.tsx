import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import {
	type DropdownMenuItemColor,
	getDropdownMenuItemClassName,
} from "./dropdownMenuItemStyles";

type DropdownMenuItemProps = ComponentPropsWithoutRef<
	typeof DropdownMenu.Item
> & {
	color?: DropdownMenuItemColor;
};

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
	function DropdownMenuItem({ className, color = "gray", ...props }, ref) {
		return (
			<DropdownMenu.Item
				ref={ref}
				className={getDropdownMenuItemClassName(color, className)}
				{...props}
			/>
		);
	},
);

export default DropdownMenuItem;
