import { cn } from "@app/utils";

const colorToClass: Record<string, string> = {
	blue: "bg-blue-600",
	green: "bg-green-600",
	red: "bg-red-600",
};

interface ProgressBarAffixedProps {
	bottom?: boolean;
	className?: string;
	color?: string;
	now: number;
}

export default function ProgressBarAffixed({
	bottom,
	className,
	color = "blue",
	now,
}: ProgressBarAffixedProps) {
	return (
		<div
			className={cn(
				"absolute left-0 m-0 h-1.5 w-full overflow-hidden",
				bottom ? "bottom-0" : "top-0",
				className,
			)}
		>
			<div
				className={cn("h-full", colorToClass[color] || "bg-blue-600")}
				style={{ width: `${now}%` }}
			/>
		</div>
	);
}
