import React from "react";
import Alert from "../../base/Alert";

type SampleFilesMessageProps = {
    /** Indicates whether to show the alert for legacy sample uploads */
    showLegacy: boolean;
};

/**
 * Displays an alert message regarding legacy sample uploads
 */
export default function SampleFilesMessage({
    showLegacy,
}: SampleFilesMessageProps) {
    return showLegacy ? (
        <Alert color="orange" block>
            <p>
                <strong>
                    Virtool now retains raw data for newly created samples
                    instead of trimming during sample creation.
                </strong>
                <p>
                    Because this is an older sample, only trimmed data is
                    available. Recreate the sample to run analysis with
                    untrimmed reads.
                </p>
            </p>
        </Alert>
    ) : null;
}
