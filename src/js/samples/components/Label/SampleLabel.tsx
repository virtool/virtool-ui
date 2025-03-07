import Icon from "@base/Icon";
import React from "react";
import { BaseSampleLabel } from "./BaseSampleLabel";

type SampleLabelProps = {
    /** The class name being used for the component */
    className?: string;
    /** The color assigned to the label */
    color: string;
    /** The name of the label */
    name: string;
};

/**
 * Displays the label and the color associated with it
 */
export function SampleLabel({ className, color, name }: SampleLabelProps) {
    return (
        <BaseSampleLabel className={className} color={color}>
            {color && <Icon name="circle" />}
            {name}
        </BaseSampleLabel>
    );
}
