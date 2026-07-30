import { DropdownMenu } from "radix-ui";
import type { ReactNode } from "react";
import Button from "./Button";

type DropdownButtonProps = {
	/** Names the trigger where its children are a bare value or an icon */
	"aria-label"?: string;

	children: ReactNode;
	className?: string;
};

export default function DropdownButton({
	"aria-label": ariaLabel,
	children,
	className,
}: DropdownButtonProps) {
	return (
		<Button
			aria-label={ariaLabel}
			as={DropdownMenu.Trigger}
			className={className}
		>
			{children}
		</Button>
	);
}
