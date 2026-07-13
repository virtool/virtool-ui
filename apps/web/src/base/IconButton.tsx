import { cn } from "@app/utils";
import type { LucideIcon } from "lucide-react";
import type { ElementType } from "react";
import { iconButtonVariants } from "./iconButtonVariants";
import Tooltip from "./Tooltip";
import type { IconColor } from "./types";

export type IconButtonProps = {
	/** Accessible name for the button. Defaults to ``tip``. */
	ariaLabel?: string;
	/** The element to render as. Defaults to ``button``. */
	as?: ElementType;
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
	as = "button",
	className,
	color = "black",
	IconComponent,
	onClick,
	size,
	tip,
	tipPlacement,
}: IconButtonProps) {
	const As = as;

	const iconButton = (
		<As
			className={cn(iconButtonVariants({ color }), className)}
			aria-label={ariaLabel ?? tip}
			type="button"
			onClick={onClick}
		>
			<IconComponent size={size ?? "1.2em"} />
		</As>
	);

	return (
		<Tooltip position={tipPlacement || "top"} tip={tip}>
			{iconButton}
		</Tooltip>
	);
}
