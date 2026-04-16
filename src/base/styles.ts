/** Base classes shared by Input and InputSimple */
export const inputBaseClasses =
	"bg-white border rounded-[3px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] block text-sm h-auto outline-none py-2 px-2.5 relative transition-all duration-150 ease-in-out w-full";

/** Focus ring for inputs in normal (non-error) state */
export const inputFocusClasses =
	"border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50";

/** Focus ring + border for inputs in error state */
export const inputErrorClasses =
	"border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50";

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
