import { cn } from "@app/utils";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";

type ArchivedNoticeProps = {
	children: ReactNode;
	className?: string;
};

export default function ArchivedNotice({
	children,
	className,
}: ArchivedNoticeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 px-2 py-1",
				"text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded",
				className,
			)}
		>
			<Lock size={12} /> {children}
		</span>
	);
}
