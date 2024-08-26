import { LoadingPlaceholder } from "@base";
import { Quality } from "@quality/components/Quality";
import React from "react";
import { useParams } from "react-router-dom-v5-compat";
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

/**
 * Samples quality view showing charts for bases, composition, and sequences
 */
export default function SampleQuality() {
    const { sampleId } = useParams();
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
