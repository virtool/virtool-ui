import { cn } from "@app/cn";
import type { ReactNode } from "react";
import Badge from "./Badge";
import type { PaletteColor } from "./types";

type ViewHeaderTitleBadge = {
	children?: ReactNode;
	className?: string;
	color?: PaletteColor;
};

/**
 * A styled Badge component for use in view headers
 */
export default function ViewHeaderTitleBadge({
	children,
	className,
	color,
}: ViewHeaderTitleBadge) {
	return (
		<Badge className={cn("text-base ml-2", className)} color={color}>
			{children}
		</Badge>
	);
}
