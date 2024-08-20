import { LoadingPlaceholder } from "@base";
import { Quality } from "@quality/components/Quality";
import React from "react";
import { match } from "react-router-dom";
import styled from "styled-components";
import { useFetchSample } from "../queries";
import LegacyAlert from "./SampleFilesMessage";

const SampleQualityLegacyAlert = styled(LegacyAlert)`
    margin-bottom: 20px;
`;

const StyledSampleQuality = styled.div`
    display: flex;
    flex-direction: column;
`;

type SampleQualityProps = {
    /** Match object containing path information */
    match: match<{ sampleId: string }>;
};

/**
 * Samples quality view showing charts for bases, composition, and sequences
 */
export default function SampleQuality({ match }: SampleQualityProps) {
    const { data, isPending } = useFetchSample(match.params.sampleId);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <StyledSampleQuality>
            <SampleQualityLegacyAlert showLegacy={data.is_legacy} />
            <Quality
                bases={data.quality.bases}
                composition={data.quality.composition}
                sequences={data.quality.sequences}
            />
        </StyledSampleQuality>
    );
}
