import { cn } from "@app/cn";

/** The palette shared by all selectable dropdown menu items. */
export type DropdownMenuItemColor =
	| "blue"
	| "green"
	| "gray"
	| "orange"
	| "purple"
	| "red";

const itemColors: Record<DropdownMenuItemColor, string> = {
	blue: "text-blue-600 focus:bg-blue-50 focus:text-blue-700",
	green: "text-green-600 focus:bg-green-50 focus:text-green-700",
	gray: "text-gray-900 focus:bg-gray-100 focus:text-gray-900",
	orange: "text-orange-600 focus:bg-orange-50 focus:text-orange-700",
	purple: "text-purple-600 focus:bg-purple-50 focus:text-purple-700",
	red: "text-red-600 focus:bg-red-50 focus:text-red-700",
};

/**
 * Radix moves DOM focus between menu items during keyboard navigation and on
 * pointer enter, so `focus:` covers both hover and arrow-key highlighting.
 */
export function getDropdownMenuItemClassName(
	color: DropdownMenuItemColor,
	className?: string,
): string {
	return cn(
		"cursor-pointer flex gap-2 items-center outline-hidden px-2 py-1.5 relative rounded-sm select-none text-sm",
		"data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0",
		"[&_svg:not([class*='size-'])]:size-4",
		itemColors[color],
		className,
	);
}
