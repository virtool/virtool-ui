import { Label } from "@base";
import React from "react";

export function IimiDetectionTag({ result }) {
    return result ? (
        <Label color="red">Detected</Label>
    ) : (
        <Label>Undetected</Label>
    );
}
