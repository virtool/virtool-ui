import { cn } from "@app/utils";
import type { ElementType, KeyboardEvent, ReactNode } from "react";

type BoxGroupSectionProps = {
	active?: boolean;
	"aria-selected"?: boolean;
	as?: ElementType;
	children?: ReactNode;
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
	onKeyDown?: (e: KeyboardEvent) => void;
	role?: string;
	style?: React.CSSProperties;
	tabIndex?: number;
};

export default function BoxGroupSection({
	as: Component = "div",
	children,
	className = "",
	...props
}: BoxGroupSectionProps) {
	return (
		<Component
			className={cn(
				"bg-transparent",
				"block",
				"border-gray-300",
				"not-last:border-b-1",
				"py-3",
				"px-6",
				"relative",
				"text-inherit",
				"w-full",
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	);
}
