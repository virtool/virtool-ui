import { DropdownMenu } from "radix-ui";
import type { ReactNode } from "react";
import Button from "./Button";

type DropdownButtonProps = {
	children: ReactNode;
	className?: string;
};

export default function DropdownButton({
	children,
	className,
}: DropdownButtonProps) {
	return (
		<Button as={DropdownMenu.Trigger} className={className}>
			{children}
		</Button>
	);
}
