import { cn } from "@app/utils";
import type { KeyboardEvent, ReactNode } from "react";

type BoxProps = {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
};

function Box({ children, className = "", onClick, ...rest }: BoxProps) {
	const interactiveProps = onClick
		? {
				onClick,
				onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						onClick();
					}
				},
				role: "button",
				tabIndex: 0,
			}
		: {};

	return (
		<div
			className={cn(
				{ "hover:bg-gray-100": onClick },
				"border-1",
				"border-gray-300",
				{ "cursor-pointer": onClick },
				"mb-6",
				"py-4",
				"px-4",
				"relative",
				"rounded-sm",
				className,
			)}
			{...interactiveProps}
			{...rest}
		>
			{children}
		</div>
	);
}

export default Box;
