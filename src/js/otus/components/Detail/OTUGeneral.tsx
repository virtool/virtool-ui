import React from "react";
import { OTUIsolate } from "../../types";
import OtuIssues from "./OtuIssues";

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
    return issues ? <OtuIssues issues={issues} isolates={isolates} /> : null;
}
