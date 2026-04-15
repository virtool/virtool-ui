import { cn } from "@app/utils";

const colorToClass: Record<string, string> = {
	blue: "border-blue-600",
	green: "border-green-600",
	grey: "border-gray-400",
	greyDark: "border-gray-500",
	red: "border-red-600",
};

interface LoaderProps {
	className?: string;
	color?: string;
	size?: string;
}

export default function Loader({
	className,
	color = "greyDark",
	size = "22px",
}: LoaderProps) {
	return (
		<div
			role="status"
			aria-label="loading"
			className={cn(
				"animate-rotate inline-block rounded-full border-2 border-b-transparent",
				colorToClass[color] || "border-gray-500",
				className,
			)}
			style={{ width: size, height: size }}
		/>
	);
}
