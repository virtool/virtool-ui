import { cn } from "@app/utils";
import type { ReactNode } from "react";
import { buttonVariants } from "./buttonVariants";
import Link from "./Link";

interface LinkButtonProps {
	children?: ReactNode;
	className?: string;
	color?: "blue" | "gray" | "green" | "red";
	replace?: boolean;
	to: string;
}

export default function LinkButton({
	children,
	className,
	color = "gray",
	replace = false,
	to,
}: LinkButtonProps) {
	return (
		<Link
			className={cn(buttonVariants({ color }), className)}
			replace={replace}
			to={to}
		>
			{children}
		</Link>
	);
}
