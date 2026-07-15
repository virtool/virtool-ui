/** The shared colour palette every base component's `color` prop accepts. */
export type PaletteColor =
	| "blue"
	| "green"
	| "gray"
	| "orange"
	| "purple"
	| "red";

/** The palette plus `black`, for icon-based components. */
export type IconColor = PaletteColor | "black";
