import { cn } from "@/app/utils";
import Circle from "@base/Circle";
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
            color={color}
            className={cn(
                "cursor-pointer my-1 mr-2 last:mr-0",
                "hover:bg-gray-50 hover:border-blue-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                pressed && "border-blue-500 ring-2 ring-blue-200",
                pressed && "bg-blue-50",
            )}
            aria-pressed={pressed}
            onClick={() => onClick(id)}
        >
            <Circle />
            {name}
        </BaseSampleLabel>
    );
}
