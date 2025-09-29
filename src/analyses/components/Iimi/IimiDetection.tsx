import AnalysisValue from "@analyses/components/AnalysisValue";

type IimiDetectionTagProps = {
    probability: number;
    result: boolean;
};

/**
 * tag showing the detection results for an isolate or sequence
 */
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
