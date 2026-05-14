import { cn } from "@app/utils";
import type { ReactNode } from "react";

type SidebarHeaderProps = {
	children?: ReactNode;
	className?: string;
};

export default function SidebarHeader({
	children,
	className,
}: SidebarHeaderProps) {
	return (
		<h3
			className={cn(
				"flex items-center text-base font-medium mt-1 mb-2.5 h-8 [&>a]:ml-auto [&>a]:text-sm [&>button]:ml-auto",
				className,
			)}
		>
			{children}
		</h3>
	);
}

SidebarHeader.displayName = "SidebarHeader";
