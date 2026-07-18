import { cn } from "@app/cn";
import type { ReactNode } from "react";
import { BarsLegendItem } from "./BarsLegendItem";
import { type BarColor, bgColorClasses } from "./colors";

type BarItemProps = {
	color?: BarColor;
	empty?: boolean;
	size: number;
};

function BarItem({ color, empty, size }: BarItemProps) {
	return (
		<div
			className={cn(
				empty ? "bg-white shadow-inner" : color && bgColorClasses[color],
			)}
			style={{ flex: `${size / 100} 0 auto` }}
		/>
	);
}

/** A single coloured segment and legend entry in a {@link Bars} chart */
export type BarsItem = {
	color: BarColor;
	count: number;
	title: ReactNode;
};

type BarsProps = {
	empty?: number;
	items: BarsItem[];
};

export function Bars({ empty, items }: BarsProps) {
	return (
		<div className="relative mb-2.5">
			<div className="flex h-8 mb-4 overflow-hidden border border-gray-300 rounded-md z-10">
				{items.map(({ color, count }) => (
					<BarItem key={color} color={color} size={count} />
				))}
				{empty && <BarItem key="empty" empty size={empty} />}
			</div>
			<div>
				{items.map(({ color, count, title }) => (
					<BarsLegendItem
						key={color}
						color={color}
						count={count}
						title={title}
					/>
				))}
			</div>
		</div>
	);
}
