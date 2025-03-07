import Label from '@base/Label';
import React from "react";

export function IimiDetectionTag({ result }) {
    return result ? (
        <Label color="red">Detected</Label>
    ) : (
        <Label>Undetected</Label>
    );
}
