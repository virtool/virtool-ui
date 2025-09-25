import { cn } from "@/app/utils";
import Icon from "@base/Icon";
import React from "react";
import { BaseSampleLabel } from "../Label/BaseSampleLabel";

type LabelFilterItemProps = {
    color: string;
    id: number;
    name: string;
    pressed: boolean;
    onClick: (id: string) => void;
};

export default function LabelFilterItem({
    color,
    id,
    name,
    pressed,
    onClick,
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
                pressed && "bg-blue-50", // Add a background color to make it more visible
            )}
            aria-pressed={pressed}
            onClick={() => onClick(id.toString())}
        >
            <Icon name="circle" />
            {name}
        </BaseSampleLabel>
    );
}
