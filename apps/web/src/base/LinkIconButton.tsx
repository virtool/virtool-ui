import { cn } from "@app/utils";
import type { LucideIcon } from "lucide-react";
import { iconButtonVariants } from "./iconButtonVariants";
import Link from "./Link";
import Tooltip from "./Tooltip";
import type { IconColor } from "./types";

type LinkIconButtonProps = {
	/** Accessible name for the link. Defaults to ``tip``. */
	ariaLabel?: string;
	className?: string;
	color?: IconColor;
	IconComponent: LucideIcon;
	/** The query string to navigate with. */
	search?: Record<string, unknown>;
	size?: number;
	tip: string;
	tipPlacement?: "top" | "right" | "bottom" | "left";
	/** The route to navigate to. */
	to: string;
};

/**
 * An icon that navigates, styled and tipped like an {@link IconButton}. Use
 * where the action is going somewhere rather than doing something.
 */
export default function LinkIconButton({
	ariaLabel,
	className,
	color = "black",
	IconComponent,
	search,
	size,
	tip,
	tipPlacement,
	to,
}: LinkIconButtonProps) {
	return (
		<Tooltip position={tipPlacement || "top"} tip={tip}>
			<Link
				aria-label={ariaLabel ?? tip}
				className={cn(iconButtonVariants({ color }), "inline-flex", className)}
				search={search}
				to={to}
			>
				<IconComponent size={size ?? "1.2em"} />
			</Link>
		</Tooltip>
	);
}
