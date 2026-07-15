import { cn } from "@app/cn";
import type { PaletteColor } from "./types";

export const colorToClass: Record<PaletteColor, string> = {
	blue: "border-t-blue-600 border-x-blue-600",
	green: "border-t-green-600 border-x-green-600",
	gray: "border-t-gray-500 border-x-gray-500",
	orange: "border-t-orange-600 border-x-orange-600",
	purple: "border-t-purple-600 border-x-purple-600",
	red: "border-t-red-600 border-x-red-600",
};

type LoaderProps = {
	className?: string;
	color?: PaletteColor;
	size?: string;
};

export default function Loader({
	className,
	color = "gray",
	size = "22px",
}: LoaderProps) {
	return (
		<div
			role="status"
			aria-label="loading"
			className={cn(
				"animate-rotate inline-block rounded-full border-2 border-b-transparent",
				colorToClass[color],
				className,
			)}
			style={{ width: size, height: size }}
		/>
	);
}
