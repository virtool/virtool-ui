import React from "react";
import { Label } from "../../../base";

export function IimiDetectionTag({ result }) {
    return result ? <Label color="red">Detected</Label> : <Label color="grey">Undetected</Label>;
}
