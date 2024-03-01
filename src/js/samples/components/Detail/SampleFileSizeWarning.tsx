import React from "react";
import { Link } from "react-router-dom";
import { Alert, Icon } from "../../../base";

type SampleFileSizeWarningProps = {
    sampleId: string;
    show: boolean;
    showLink: boolean;
};

/**
 * Displays a warning if any sample files are under 10 megabytes
 */
export default function SampleFileSizeWarning({ sampleId, show, showLink }: SampleFileSizeWarningProps) {
    if (show) {
        const link = showLink ? (
            <Link to={`/samples/${sampleId}/files`}>Check the file sizes</Link>
        ) : (
            "Check the file sizes"
        );

        return (
            <Alert color="orange" level>
                <Icon name="exclamation-triangle" />
                <span>
                    <strong>The read files in this sample are smaller than expected. </strong>
                    <span>{link} and ensure they are correct.</span>
                </span>
            </Alert>
        );
    }

    return null;
}
