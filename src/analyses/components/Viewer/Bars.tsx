import { cn } from "@app/utils";
import { BarsLegendItem } from "./BarsLegendItem";

const bgColorClasses: Record<string, string> = {
	blue: "bg-blue-600",
	green: "bg-green-600",
	orange: "bg-amber-500",
	purple: "bg-purple-400",
	red: "bg-red-600",
};

type BarItemProps = {
	color: string;
	empty?: boolean;
	size: number;
};

function BarItem({ color, empty, size }: BarItemProps) {
	return (
		<div
			className={cn(empty ? "bg-white shadow-inner" : bgColorClasses[color])}
			style={{ flex: `${size / 100} 0 auto` }}
		/>
	);
}

export function Bars({ empty, items }) {
	return (
		<div className="relative mb-2.5">
			<div className="flex h-8 mb-4 overflow-hidden border border-gray-300 rounded-md z-10">
				{items.map(({ color, count }) => (
					<BarItem key={color} color={color} size={count} />
				))}
				{empty && <BarItem key="empty" color="white" empty size={empty} />}
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
