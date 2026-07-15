import { cn } from "@app/cn";
import { Download } from "lucide-react";
import type { ReactNode } from "react";

export type DownloadLinkProps = {
	children: ReactNode;
	className?: string;
	href: string;
	/** Compact sizing, for use inside a toolbar. Defaults to `"md"`. */
	size?: "sm" | "md";
};

/**
 * An anchor styled as a download action, prefixed with a download icon so it
 * reads as a control rather than plain link text.
 */
export function DownloadLink({
	children,
	className,
	href,
	size = "md",
}: DownloadLinkProps) {
	return (
		<a
			className={cn(
				"inline-flex items-center gap-1.5 rounded-md border border-gray-300",
				"px-2.5 py-1.5 font-medium text-gray-700",
				size === "sm" ? "text-xs" : "text-sm",
				"hover:bg-gray-100 hover:text-gray-900",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
				className,
			)}
			href={href}
			download
		>
			<Download size={size === "sm" ? 14 : 16} />
			{children}
		</a>
	);
}
