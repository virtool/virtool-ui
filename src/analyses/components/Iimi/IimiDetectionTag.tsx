import Label from "../../../base/Label";
import React from "react";

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
