import { LoadingPlaceholder } from "@base";
import { Quality } from "@quality/components/Quality";
import React from "react";
import styled from "styled-components";
import { useParams } from "wouter";
import { useFetchSample } from "../queries";
import LegacyAlert from "./SampleFilesMessage";

const SampleQualityLegacyAlert = styled(LegacyAlert)`
    margin-bottom: 20px;
`;

const StyledSampleQuality = styled.div`
    display: flex;
    flex-direction: column;
`;

/**
 * Samples quality view showing charts for bases, composition, and sequences
 */
export default function SampleQuality() {
    const { sampleId } = useParams<{ sampleId: string }>();
    const { data, isPending } = useFetchSample(sampleId);

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
