import { cn } from "@app/utils";
import type { ReactNode } from "react";

type NavTabsProps = {
	children: ReactNode;
	className?: string;
};

/**
 * A styled tabs component used for navigating
 */
export default function NavTabs({ children, className }: NavTabsProps) {
	return (
		<nav
			className={cn(
				"border-b",
				"border-gray-300",
				"flex",
				"mb-4",
				"w-full",
				className,
			)}
		>
			{children}
		</nav>
	);
}
