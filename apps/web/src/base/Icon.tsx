import { cn } from "@app/cn";
import type { LucideIcon } from "lucide-react";
import { iconVariants } from "./iconVariants";
import type { IconColor } from "./types";

export type IconProps = {
	color?: IconColor;
	icon: LucideIcon;
	className?: string;
	size?: number;
};

export default function Icon({
	color,
	icon: LucideIcon,
	className,
	size = 18,
	...props
}: IconProps) {
	return (
		<LucideIcon
			className={cn(
				"bg-inherit",
				"border-none",
				"text-inherit",
				"inline-block",
				"align-middle",
				iconVariants({ color }),
				className,
			)}
			size={size}
			{...props}
		/>
	);
}
