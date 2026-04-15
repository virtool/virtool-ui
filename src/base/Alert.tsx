import { cn } from "@app/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Icon from "./Icon";

const alertColorStyles: Record<string, string> = {
	orange: "bg-amber-100 text-amber-600",
	red: "bg-red-100 text-red-700",
	blue: "bg-blue-100 text-blue-700",
	green: "bg-green-100 text-green-700",
};

const defaultColorStyle = "bg-gray-100 text-gray-600";

type AlertProps = {
	block?: boolean;
	children: ReactNode;
	className?: string;
	color?: string;
	icon?: LucideIcon;
	level?: boolean;
	outerClassName?: string;
};

function Alert({
	block,
	children,
	className,
	color,
	icon,
	level,
	outerClassName,
}: AlertProps) {
	return (
		<div
			className={cn(
				"rounded-md shadow-sm font-medium mb-4 overflow-hidden",
				alertColorStyles[color] ?? defaultColorStyle,
				outerClassName,
			)}
		>
			<div
				className={cn(
					"p-4 [&>svg:first-child]:pr-1",
					block ? "block" : "flex",
					level && "items-center",
					className,
				)}
			>
				{icon ? <Icon icon={icon} size={30} /> : null}
				{children}
			</div>
		</div>
	);
}

Alert.displayName = "Alert";

export default Alert;
