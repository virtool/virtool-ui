import { toThousand } from "@app/utils";
import Icon from "@base/Icon";
import type { IconColor } from "@base/types";
import { Circle } from "lucide-react";

interface BarsLegendItemProps {
	color: IconColor;
	count: number;
	title: string;
}

export function BarsLegendItem({ color, count, title }: BarsLegendItemProps) {
	return (
		<div className="flex items-center mt-0.5 max-w-md [&_i:first-child]:mr-2.5">
			<Icon icon={Circle} color={color} />
			<span>{title}</span>
			<span className="ml-auto">{toThousand(count)}</span>
		</div>
	);
}
