import { cn } from "@app/utils";
import type { ReactNode } from "react";
import { buttonVariants } from "./buttonVariants";
import Link from "./Link";

type LinkButtonProps = {
	children?: ReactNode;
	className?: string;
	color?: "blue" | "gray" | "green" | "red";
	replace?: boolean;
	search?: Record<string, unknown>;
	size?: "small" | "large";
	to: string;
};

export default function LinkButton({
	children,
	className,
	color = "gray",
	replace = false,
	search,
	size = "large",
	to,
}: LinkButtonProps) {
	return (
		<Link
			className={cn(buttonVariants({ color, size }), "gap-1.5", className)}
			replace={replace}
			search={search}
			to={to}
		>
			{children}
		</Link>
	);
}
