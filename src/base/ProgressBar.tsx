import { cn } from "@app/utils";

const colorToClass: Record<string, string> = {
	blue: "bg-blue-600",
	green: "bg-green-600",
	red: "bg-red-600",
};

interface ProgressBarProps {
	now: number;
	color?: string;
}

export default function ProgressBar({ now, color = "blue" }: ProgressBarProps) {
	return (
		<div className="mb-2.5 h-5 w-full bg-gray-400">
			<div
				className={cn("h-full", colorToClass[color] || "bg-blue-600")}
				style={{ width: `${now}%` }}
			/>
		</div>
	);
}
