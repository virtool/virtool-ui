import { cn } from "@app/cn";
import type { AriaRole, ReactNode } from "react";
import Box from "./Box";

type BoxGroupProps = {
	children: ReactNode;
	className?: string;
	id?: string;
	role?: AriaRole;
	"aria-labelledby"?: string;
	"aria-multiselectable"?: boolean;
};

export default function BoxGroup({
	children,
	className = "",
	...rest
}: BoxGroupProps) {
	return (
		<Box className={cn("p-0", "relative", "rounded-sm", className)} {...rest}>
			{children}
		</Box>
	);
}
