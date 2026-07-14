import { DropdownMenu } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import {
	type DropdownMenuItemColor,
	getDropdownMenuItemClassName,
} from "./dropdownMenuItemStyles";

type DropdownMenuItemProps = ComponentPropsWithRef<typeof DropdownMenu.Item> & {
	color?: DropdownMenuItemColor;
};

export default function DropdownMenuItem({
	className,
	color = "gray",
	...props
}: DropdownMenuItemProps) {
	return (
		<DropdownMenu.Item
			className={getDropdownMenuItemClassName(color, className)}
			{...props}
		/>
	);
}
