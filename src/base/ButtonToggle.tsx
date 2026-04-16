import { cn } from "@app/utils";
import { Toggle } from "radix-ui";
import type { ReactNode, Ref } from "react";
import { buttonVariants } from "./buttonVariants";

type ButtonToggleProps = {
	children: ReactNode;
	onPressedChange: (pressed: boolean) => void;
	pressed: boolean;
	ref?: Ref<HTMLButtonElement>;
};

export default function ButtonToggle({
	children,
	onPressedChange,
	pressed,
	ref,
}: ButtonToggleProps) {
	return (
		<Toggle.Root
			className={cn(buttonVariants(), "active:inset-2")}
			onPressedChange={onPressedChange}
			pressed={pressed}
			ref={ref}
		>
			{children}
		</Toggle.Root>
	);
}
