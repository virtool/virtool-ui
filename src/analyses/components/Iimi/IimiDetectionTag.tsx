import React from "react";
import Label from "../../../base/Label";

type IimiDetectionTagProps = {
    probability: number;
    result: boolean;
};

export function IimiDetectionTag({
    probability,
    result,
}: IimiDetectionTagProps) {
    if (probability === undefined) {
        return result ? (
            <Label color="red">Detected</Label>
        ) : (
            <Label>Undetected</Label>
        );
    }

    return <Label>{probability}</Label>;
}
