import { cn } from "@app/utils";
import type { ReactNode } from "react";

type SectionHeaderProps = {
	children: ReactNode;
	className?: string;
};

export default function SectionHeader({
	children,
	className = "",
}: SectionHeaderProps) {
	return (
		<header
			className={cn(
				"mb-5",
				"[&_h2]:mb-1.5",
				"[&_h2]:text-2xl",
				"[&_p]:text-gray-600",
				"[&_p]:text-base",
				"[&_p]:font-medium",
				className,
			)}
		>
			{children}
		</header>
	);
}
