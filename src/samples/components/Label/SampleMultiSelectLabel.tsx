import Icon from "@base/Icon";
import React from "react";
import { BaseSampleLabel } from "./BaseSampleLabel";

type SampleMultiSelectLabelProps = {
    /** The class name being used for the component */
    className?: string;
    /** The color assigned to the label */
    color: string;
    /** The name of the label */
    name: string;
    /** Whether all selected samples have the label assigned */
    partiallySelected: boolean;
    /** The size variant */
    size?: "sm" | "md";
};

/**
 * Displays labels for the selected samples and indicate whether each label applies to all selected samples
 */
export default function SampleMultiSelectLabel({
    className,
    color,
    name,
    partiallySelected,
    size = "md",
}: SampleMultiSelectLabelProps) {
    return (
        <BaseSampleLabel className={className} color={color} size={size}>
            {color && <Icon name={partiallySelected ? "adjust" : "circle"} />}
            {name}
        </BaseSampleLabel>
    );
}
