import React from "react";
import { Label } from "../../../base";

export function IimiDetectionTag({ result }) {
    return result ? <Label className="bg-red">Detected</Label> : <Label className="bg-grey">Undetected</Label>;
}
