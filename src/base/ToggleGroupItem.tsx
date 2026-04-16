import { cn } from "@app/utils";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import type { ReactNode } from "react";
import { buttonVariants } from "./buttonVariants";

type ToggleGroupItemProps = {
	children: ReactNode;
	value: string;
};

export default function ToggleGroupItem({
	children,
	value,
}: ToggleGroupItemProps) {
	return (
		<ToggleGroupPrimitive.Item
			className={cn(
				buttonVariants(),
				"rounded-none",
				"aria-checked:bg-gray-300",
				"first:rounded-l-md",
				"last:rounded-r-md",
			)}
			value={value}
		>
			{children}
		</ToggleGroupPrimitive.Item>
	);
}
