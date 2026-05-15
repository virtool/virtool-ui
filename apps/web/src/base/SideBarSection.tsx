import { cn } from "@app/utils";
import type { ReactNode } from "react";
import Box from "./Box";

type SideBarSectionProps = {
	children: ReactNode;
	className?: string;
};

export default function SideBarSection({
	children,
	className = "",
}: SideBarSectionProps) {
	return (
		<Box
			className={cn(
				"bg-gray-100",
				"border-0",
				"rounded-md",
				"shadow-sm",
				"mb-4",
				"static",
				className,
			)}
		>
			{children}
		</Box>
	);
}
