import React from "react";
import { Alert } from "../../base";

type SampleFilesMessageProps = {
    /** Indicates whether to show the alert for legacy sample files */
    showLegacy: boolean;
};

/**
 * Displays an alert message regarding legacy sample files
 */
export default function SampleFilesMessage({ showLegacy }: SampleFilesMessageProps) {
    return showLegacy ? (
        <Alert color="orange" block>
            <p>
                <strong>
                    Virtool now retains raw data for newly created samples instead of trimming during sample creation.
                </strong>
            </p>
        </Alert>
    ) : null;
}
