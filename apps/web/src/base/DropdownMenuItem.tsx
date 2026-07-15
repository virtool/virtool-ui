import { DropdownMenu } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { getDropdownMenuItemClassName } from "./dropdownMenuItemStyles";
import type { PaletteColor } from "./types";

type DropdownMenuItemProps = ComponentPropsWithRef<typeof DropdownMenu.Item> & {
	color?: PaletteColor;
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
