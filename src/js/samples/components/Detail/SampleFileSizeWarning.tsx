import { Alert, Icon } from "@base";
import { endsWith, some } from "lodash-es";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Read } from "../../types";

type SampleFileSizeWarningProps = {
    reads: Read[];
    sampleId: string;
};

/**
 * Displays a warning if any sample files are under 10 megabytes
 */
export default function SampleFileSizeWarning({ reads, sampleId }: SampleFileSizeWarningProps) {
    const location = useLocation();
    const show = some(reads, file => file.size < 10000000);

    if (show) {
        const showLink = !endsWith(location.pathname, "/files");

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
