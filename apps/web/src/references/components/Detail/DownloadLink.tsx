import { cn } from "@app/utils";
import { Download } from "lucide-react";
import type { ReactNode } from "react";

export type DownloadLinkProps = {
	children: ReactNode;
	className?: string;
	href: string;
};

/**
 * An anchor styled as a download action, prefixed with a download icon so it
 * reads as a control rather than plain link text.
 */
export function DownloadLink({ children, className, href }: DownloadLinkProps) {
	return (
		<a
			className={cn(
				"inline-flex items-center gap-1.5 rounded-md border border-gray-300",
				"px-2.5 py-1.5 text-sm font-medium text-gray-700",
				"hover:bg-gray-100 hover:text-gray-900",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
				className,
			)}
			href={href}
			download
		>
			<Download size={16} />
			{children}
		</a>
	);
}
