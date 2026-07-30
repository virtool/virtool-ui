import { Toggle } from "radix-ui";
import type { ReactNode, Ref } from "react";
import { buttonVariants } from "./buttonVariants";

type ButtonToggleProps = {
	/** Names the toggle where its children are an icon and say nothing */
	ariaLabel?: string;

	children: ReactNode;
	onPressedChange: (pressed: boolean) => void;
	pressed: boolean;
	ref?: Ref<HTMLButtonElement>;
};

export default function ButtonToggle({
	ariaLabel,
	children,
	onPressedChange,
	pressed,
	ref,
}: ButtonToggleProps) {
	return (
		<Toggle.Root
			aria-label={ariaLabel}
			className={buttonVariants()}
			onPressedChange={onPressedChange}
			pressed={pressed}
			ref={ref}
		>
			{children}
		</Toggle.Root>
	);
}
