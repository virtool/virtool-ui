import Circle from "@base/Circle";
import { cn } from "@/app/utils";
import { BaseSampleLabel } from "../Label/BaseSampleLabel";

type LabelFilterItemProps = {
	color: string;
	id: number;
	name: string;
	onClick: (id: number) => void;
	pressed: boolean;
};

export default function LabelFilterItem({
	color,
	id,
	name,
	onClick,
	pressed,
}: LabelFilterItemProps) {
	return (
		<BaseSampleLabel
			as="button"
			type="button"
			color={color}
			className={cn(
				"cursor-pointer my-1 mr-2 last:mr-0",
				"hover:bg-gray-50 hover:border-blue-300",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
				pressed &&
					"border-gray-400 bg-gray-300 hover:bg-gray-300 hover:border-gray-400",
			)}
			aria-pressed={pressed}
			onClick={() => onClick(id)}
		>
			<Circle />
			{name}
		</BaseSampleLabel>
	);
}
