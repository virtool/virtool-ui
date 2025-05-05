import React from "react";
import SmallSampleLabel from "../Label/SmallSampleLabel";

type SampleLabelInnerProps = {
    color: string;
    name: string;
};

/**
 * Styled label item for use in dropdown list of labels
 */
export default function SampleLabelInner({
    color,
    name,
}: SampleLabelInnerProps) {
    return <SmallSampleLabel color={color} name={name} />;
}
