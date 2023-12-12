import React from "react";

import { Link } from "react-router-dom";
import { Alert, Icon } from "../../base";

interface AnalysisHMMAlertProps {
    installed: boolean;
}

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
