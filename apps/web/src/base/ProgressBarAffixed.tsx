import { cn } from "@app/cn";
import type { PaletteColor } from "./types";

const colorToClass: Record<PaletteColor, string> = {
	blue: "bg-blue-600",
	green: "bg-green-600",
	gray: "bg-gray-500",
	orange: "bg-orange-600",
	purple: "bg-purple-600",
	red: "bg-red-600",
};

type ProgressBarAffixedProps = {
	bottom?: boolean;
	className?: string;
	color?: PaletteColor;
	now: number;
};

export default function ProgressBarAffixed({
	bottom,
	className,
	color = "blue",
	now,
}: ProgressBarAffixedProps) {
	return (
		<div
			className={cn(
				"absolute left-0 m-0 h-1.5 w-full overflow-hidden",
				bottom ? "bottom-0" : "top-0",
				className,
			)}
		>
			<div
				className={cn("h-full", colorToClass[color])}
				style={{ width: `${now}%` }}
			/>
		</div>
	);
}
