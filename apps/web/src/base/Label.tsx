import { cn } from "@app/cn";
import type { ReactNode } from "react";
import type { PaletteColor } from "./types";

const colorToClass: Record<PaletteColor, string> = {
	blue: "bg-blue-600",
	green: "bg-green-600",
	gray: "bg-gray-500",
	orange: "bg-orange-600",
	purple: "bg-purple-600",
	red: "bg-red-600",
};

type LabelProps = {
	children?: ReactNode;
	className?: string;
	color?: PaletteColor;
};

/**
 * A styled Label component
 */
export default function Label({
	children,
	className,
	color = "gray",
}: LabelProps) {
	return (
		<span
			className={cn(
				"items-center",
				"font-bold",
				"gap-1.5",
				"inline-flex",
				"px-2",
				"py-1",
				"rounded-md",
				"text-white",
				"text-sm",
				"whitespace-nowrap",
				"last-of-type:m-0",
				colorToClass[color],
				className,
			)}
		>
			{children}
		</span>
	);
}
