import { cn, toThousand } from "@app/utils";
import { type BarColor, bgColorClasses } from "./colors";

interface BarsLegendItemProps {
	color: BarColor;
	count: number;
	title: string;
}

export function BarsLegendItem({ color, count, title }: BarsLegendItemProps) {
	return (
		<div className="flex items-center gap-2.5 mt-0.5 max-w-md">
			<span
				aria-hidden="true"
				className={cn(
					"h-2.5 w-2.5 rounded-full shrink-0",
					bgColorClasses[color],
				)}
			/>
			<span>{title}</span>
			<span className="ml-auto">{toThousand(count)}</span>
		</div>
	);
}
