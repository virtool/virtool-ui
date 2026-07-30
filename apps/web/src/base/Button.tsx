import { cn } from "@app/cn";
import type { ElementType, ReactNode } from "react";
import { buttonVariants } from "./buttonVariants";
import type { PaletteColor } from "./types";

export type ButtonProps = {
	/** Names the button where its children are a bare value or an icon */
	"aria-label"?: string;

	active?: boolean;
	as?: ElementType;
	children: ReactNode;
	className?: string;
	color?: PaletteColor;
	disabled?: boolean;
	onBlur?: () => void;
	onClick?: () => void;
	size?: "small" | "large";
	type?: "button" | "submit";
};

function Button({
	"aria-label": ariaLabel,
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
			aria-label={ariaLabel}
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
