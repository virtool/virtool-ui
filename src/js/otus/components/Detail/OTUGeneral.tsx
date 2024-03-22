import React from "react";
import { OTUIsolate } from "../../types";
import OTUIssues from "./OTUIssues";

type OTUGeneralProps = {
    /** The isolates associated with the OTU */
    isolates: OTUIsolate[];
    /** The issues that occurred */
    issues: { [key: string]: any } | boolean;
};

/**
 * Displays a banner with related issues if any exist
 */
export default function OTUGeneral({ issues, isolates }: OTUGeneralProps) {
    return issues ? <OTUIssues issues={issues} isolates={isolates} /> : null;
}
