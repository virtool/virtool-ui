import { cn } from "@app/utils";
import type { ReactNode } from "react";
import { buttonVariants } from "./buttonVariants";
import Link from "./Link";

interface LinkButtonProps {
	children?: ReactNode;
	className?: string;
	color?: "blue" | "gray" | "green" | "red";
	replace?: boolean;
	search?: Record<string, unknown>;
	to: string;
}

export default function LinkButton({
	children,
	className,
	color = "gray",
	replace = false,
	search,
	to,
}: LinkButtonProps) {
	return (
		<Link
			className={cn(buttonVariants({ color }), className)}
			replace={replace}
			search={search as never}
			to={to}
		>
			{children}
		</Link>
	);
}
