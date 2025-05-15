import AnalysisValue from "@analyses/components/AnalysisValue";
import React from "react";

type IimiDetectionTagProps = {
    probability: number;
    result: boolean;
};

export function IimiDetection({ probability, result }: IimiDetectionTagProps) {
    if (probability === undefined) {
        return (
            <AnalysisValue
                color="green"
                label="Detected"
                value={result ? "YES" : "NO"}
            />
        );
    }

    const formattedProbability = probability.toFixed(4);

    return (
        <AnalysisValue
            color="green"
            label="PSCORE"
            value={formattedProbability}
        />
    );
}
