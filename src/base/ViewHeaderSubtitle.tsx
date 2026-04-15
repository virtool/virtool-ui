import { cn } from "@app/utils";
import type { ReactNode } from "react";

type ViewHeaderSubtitleProps = {
	children?: ReactNode;
	className?: string;
};

export default function ViewHeaderSubtitle({
	children,
	className,
}: ViewHeaderSubtitleProps) {
	return (
		<p className={cn("text-gray-600 text-base font-medium mt-1", className)}>
			{children}
		</p>
	);
}
