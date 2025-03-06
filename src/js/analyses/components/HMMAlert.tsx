import { Alert, Icon, Link } from "@/base";
import React from "react";

interface AnalysisHMMAlertProps {
    installed: boolean;
}

/** Banner informing the user when HMMs are not installed */
export default function AnalysisHMMAlert({ installed }: AnalysisHMMAlertProps) {
    if (installed) {
        return null;
    }

    return (
        <Alert color="orange" level>
            <Icon name="info-circle" />
            <span>
                <strong>HMM data is not installed. </strong>
                <Link to="/hmm">Install HMMs</Link>
                <span> to run NuV analyses.</span>
            </span>
        </Alert>
    );
}
