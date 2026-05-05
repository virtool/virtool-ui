import { CircleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/app/utils";
import { noneFoundStyle } from "./noneFoundStyle";

interface NoneFoundProps {
	noun: string;
	className?: string;
	icon?: LucideIcon;
}

export default function NoneFound({
	noun,
	className,
	icon: Icon,
}: NoneFoundProps) {
	if (Icon) {
		return (
			<div
				className={cn(
					"flex flex-col items-center justify-center gap-2 py-8 text-gray-500",
					className,
				)}
			>
				<Icon size={28} className="text-gray-400" aria-hidden />
				<p className="m-0">No {noun} found</p>
			</div>
		);
	}

	return (
		<div className={cn(noneFoundStyle, className)}>
			<CircleAlert size={18} /> No {noun} found
		</div>
	);
}
