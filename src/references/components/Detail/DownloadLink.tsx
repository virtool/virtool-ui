import { cn } from "@app/utils";
import type { ReactNode } from "react";

export type DownloadLinkProps = {
	children: ReactNode;
	className?: string;
	href: string;
};

export function DownloadLink({ children, className, href }: DownloadLinkProps) {
	return (
		<a className={cn("font-medium", className)} href={href} download>
			{children}
		</a>
	);
}
