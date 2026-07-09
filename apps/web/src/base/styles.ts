/** Base classes shared by Input and InputSimple */
export const inputBaseClasses =
	"bg-white border rounded min-w-0 block outline-none py-2 px-2.5 relative transition-[color,box-shadow] w-full placeholder:text-gray-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Explicit height shared by single-line form controls (text inputs, the Select
 * and ComboBox triggers) so they line up. Multi-line controls (textarea) and
 * chip containers use `min-h-10` instead so they can grow.
 */
export const inputHeightClass = "h-10";

/** Focus ring for inputs in normal (non-error) state */
export const inputFocusClasses =
	"border-gray-300 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/50";

/** Focus ring + border for inputs in error state */
export const inputErrorClasses =
	"border-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/50";

/**
 * Interaction and state classes shared by every Select item so hover,
 * keyboard-highlight, and disabled treatments stay consistent across the shared
 * item and the inline item renderings. Layout (padding, flex direction) is left
 * to each item.
 */
export const selectItemStateClasses =
	"relative select-none outline-none cursor-default hover:bg-gray-100 data-[highlighted]:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

import type { IconColor } from "./types";

/** Icon text color mapping shared by Icon and IconButton */
export const iconTextColor: Record<IconColor, string> = {
	black: "text-black",
	blue: "text-blue-500",
	gray: "text-gray-400",
	grayDark: "text-gray-500",
	green: "text-green-500",
	grey: "text-gray-400",
	orange: "text-orange-500",
	purple: "text-purple-500",
	red: "text-red-500",
};
