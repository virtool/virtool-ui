import { cn } from "@app/utils";
import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

type ErrorStateColor = "blue" | "green" | "gray" | "orange" | "purple" | "red";

type ErrorStateProps = {
	children?: ReactNode;
	className?: string;
	color?: ErrorStateColor;
	message?: string;
};

const iconColors: Record<ErrorStateColor, string> = {
	blue: "text-blue-500",
	green: "text-green-500",
	gray: "text-gray-500",
	orange: "text-orange-500",
	purple: "text-purple-500",
	red: "text-red-500",
};

/**
 * A centered error state with an icon, message, and optional action.
 *
 * The shared primitive behind the route-level `RouteError` retryable branch and
 * any view that needs a generic "something went wrong" fallback in place of its
 * content. Pass the recovery affordance (e.g. a "Try again" button) as
 * `children`.
 */
export default function ErrorState({
	children,
	className,
	color = "red",
	message = "Something went wrong",
}: ErrorStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center h-96 gap-4",
				className,
			)}
		>
			<CircleAlert className={cn("size-10", iconColors[color])} />
			<strong className="text-base">{message}</strong>
			{children}
		</div>
	);
}
