import { cn } from "@app/utils";
import type { ReactNode } from "react";

type BadgeProps = {
	children: ReactNode;
	className?: string;
	color?: "blue" | "green" | "gray" | "orange" | "purple" | "red";
	variant?: "solid" | "outline";
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
	if (variant === "outline") {
		return (
			<span
				className={cn(
					"align-middle font-semibold inline-flex items-center gap-1",
					"px-2 py-0.5 rounded-xl text-sm whitespace-nowrap",
					"text-gray-600 bg-gray-100 border border-gray-200",
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
				"align-middle",
				"font-bold",
				"inline-block",
				"min-w-8",
				"px-2",
				"py-1",
				"rounded-xl",
				"text-center",
				"text-sm",
				"text-white",
				"whitespace-nowrap",
				{
					"bg-blue-600": color === "blue",
					"bg-green-600": color === "green",
					"bg-gray-500": color === "gray",
					"bg-orange-600": color === "orange",
					"bg-purple-600": color === "purple",
					"bg-red-600": color === "red",
				},
				className,
			)}
		>
			{children}
		</span>
	);
}
