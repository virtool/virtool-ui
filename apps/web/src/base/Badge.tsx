import { cn } from "@app/utils";
import type { ReactNode } from "react";

type BadgeColor = "blue" | "green" | "gray" | "orange" | "purple" | "red";

type BadgeProps = {
	children: ReactNode;
	className?: string;
	color?: BadgeColor;
	variant?: "solid" | "soft";
};

const solidColors: Record<BadgeColor, string> = {
	blue: "bg-blue-600",
	green: "bg-green-600",
	gray: "bg-gray-500",
	orange: "bg-orange-600",
	purple: "bg-purple-600",
	red: "bg-red-600",
};

const softColors: Record<BadgeColor, string> = {
	blue: "bg-blue-50 text-blue-700 border-blue-200",
	green: "bg-green-50 text-green-700 border-green-200",
	gray: "bg-gray-100 text-gray-600 border-gray-200",
	orange: "bg-orange-50 text-orange-700 border-orange-200",
	purple: "bg-purple-50 text-purple-700 border-purple-200",
	red: "bg-red-50 text-red-700 border-red-200",
};

/**
 * A styled Badge component
 */
export default function Badge({
	children,
	className,
	color = "gray",
	variant = "solid",
}: BadgeProps) {
	if (variant === "soft") {
		return (
			<span
				className={cn(
					"align-middle font-semibold inline-flex items-center gap-1",
					"px-2 py-0.5 rounded-xl text-sm whitespace-nowrap border",
					softColors[color],
					className,
				)}
			>
				{children}
			</span>
		);
	}

	return (
		<span
			className={cn(
				"align-middle font-bold inline-block min-w-8 px-2 py-1 rounded-xl",
				"text-center text-sm text-white whitespace-nowrap",
				solidColors[color],
				className,
			)}
		>
			{children}
		</span>
	);
}
