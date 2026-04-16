import { cn } from "@app/utils";
import type { ComponentType, ReactNode } from "react";
import { buttonVariants } from "./buttonVariants";

export type ButtonProps = {
	active?: boolean;
	as?: string | ComponentType<any>;
	children: ReactNode;
	className?: string;
	color?: "blue" | "green" | "gray" | "purple" | "red";
	disabled?: boolean;
	onBlur?: () => void;
	onClick?: () => void;
	size?: "small" | "large";
	type?: "button" | "submit";
};

function Button({
	as = "button",
	children,
	className,
	color = "gray",
	disabled = false,
	size = "large",
	type = "button",
	onBlur,
	onClick,
}: ButtonProps) {
	const As = as;

	return (
		<As
			className={cn(
				buttonVariants({ color, size }),
				"gap-1.5",
				disabled ? "opacity-50" : "opacity-100",
				className,
			)}
			disabled={disabled}
			onBlur={onBlur}
			onClick={onClick}
			type={type}
		>
			{children}
		</As>
	);
}

export default Button;
