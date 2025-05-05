import React from "react";
import Alert from "../../base/Alert";

type RebuildIndexErrorProps = {
    error?: string;
};

/**
 * Displays an error message if there are unverified OTUs
 */
export default function RebuildIndexError({ error }: RebuildIndexErrorProps) {
    if (error) {
        const unverified = error === "There are unverified OTUs";

        return (
            <Alert color="red">
                <span>
                    <strong>
                        {error}
                        {unverified && "."}
                    </strong>
                    {unverified && (
                        <span>
                            {" "}
                            Fix the unverified OTUs before rebuilding the index.
                        </span>
                    )}
                </span>
            </Alert>
        );
    }

    return null;
}
