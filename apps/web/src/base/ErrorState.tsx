import { cn } from "@app/utils";
import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Empty, EmptyContent, EmptyMedia, EmptyTitle } from "./Empty";

type ErrorStateColor = "blue" | "green" | "gray" | "orange" | "purple" | "red";

const iconColors: Record<ErrorStateColor, string> = {
	blue: "text-blue-500",
	green: "text-green-500",
	gray: "text-gray-500",
	orange: "text-orange-500",
	purple: "text-purple-500",
	red: "text-red-500",
};

type ErrorStateProps = {
	children?: ReactNode;
	className?: string;
	color?: ErrorStateColor;
	icon?: ReactNode;
	message?: string;
};

/**
 * A centered error state with an icon, message, and optional action.
 *
 * The shared primitive behind the route-level `RouteError` retryable branch and
 * any view that needs a generic "something went wrong" fallback in place of its
 * content. Pass the recovery affordance (e.g. a "Try again" button) as
 * `children`, and override the default icon with `icon` when a different visual
 * fits.
 */
export default function ErrorState({
	children,
	className,
	color = "red",
	icon = (
		<CircleAlert
			className={cn("size-10", iconColors[color])}
			aria-hidden="true"
		/>
	),
	message = "Something went wrong",
}: ErrorStateProps) {
	return (
		<Empty className={cn("h-96", className)}>
			<EmptyMedia>{icon}</EmptyMedia>
			<EmptyTitle>{message}</EmptyTitle>
			{children ? <EmptyContent>{children}</EmptyContent> : null}
		</Empty>
	);
}
