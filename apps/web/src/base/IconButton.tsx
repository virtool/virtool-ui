import { cn } from "@app/cn";
import type { LucideIcon } from "lucide-react";
import Tooltip from "./Tooltip";
import type { IconColor } from "./types";

export type IconButtonProps = {
	/** Accessible name for the button. Defaults to ``tip``. */
	ariaLabel?: string;
	className?: string;
	color?: IconColor;
	IconComponent: LucideIcon;
	onClick?: () => void;
	size?: number;
	tip: string;
	tipPlacement?: "top" | "right" | "bottom" | "left";
};

/**
 * A styled clickable icon with tooltip describing its action
 */
export default function IconButton({
	ariaLabel,
	className,
	color = "black",
	IconComponent,
	onClick,
	size,
	tip,
	tipPlacement,
}: IconButtonProps) {
	const iconButton = (
		<button
			className={cn(
				"bg-inherit",
				"border-none",
				"cursor-pointer",
				"items-center",
				"outline-none",
				"p-2.5",
				"rounded-full",
				"text-inherit",

				{
					"text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 focus:bg-blue-500/20":
						color === "blue",
					"text-black hover:bg-black/10 focus:bg-black/20": color === "black",
					"text-green-500 hover:text-green-600 hover:bg-green-500/10 focus:bg-green-500/20":
						color === "green",
					"text-gray-400 hover:text-gray-500 hover:bg-gray-400/10 focus:bg-gray-400/20":
						color === "gray",
					"text-gray-500 hover:text-gray-600 hover:bg-gray-500/10 focus:bg-gray-500/20":
						color === "grayDark",
					"text-red-500 hover:text-red-600 hover:bg-red-500/10 focus:bg-red-500/20":
						color === "red",
					"text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 focus:bg-orange-500/20":
						color === "orange",
					"text-purple-500 hover:text-purple-600 hover:bg-purple-500/10 focus:bg-purple-500/20":
						color === "purple",
				},
				className,
			)}
			aria-label={ariaLabel ?? tip}
			type="button"
			onClick={onClick}
		>
			<IconComponent size={size ?? "1.2em"} />
		</button>
	);

	return (
		<Tooltip position={tipPlacement || "top"} tip={tip}>
			{iconButton}
		</Tooltip>
	);
}
