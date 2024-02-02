import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Quality } from "../../quality/components/Quality";
import LegacyAlert from "./SampleFilesMessage";

const SampleQualityLegacyAlert = styled(LegacyAlert)`
    margin-bottom: 20px;
`;

const StyledSampleQuality = styled.div`
    display: flex;
    flex-direction: column;
`;

type SampleQualityProps = {
    /** Data for bases chart */
    bases: number[][];
    /** Data for composition chart */
    composition: number[][];
    /** Data for sequences chart */
    sequences: number[];
};

/**
 * Samples quality view showing charts for bases, composition, and sequences
 */
export function SampleQuality({ bases, composition, sequences }: SampleQualityProps) {
    return (
        <StyledSampleQuality>
            <SampleQualityLegacyAlert />
            <Quality bases={bases} composition={composition} sequences={sequences} />
        </StyledSampleQuality>
    );
}

const mapStateToProps = state => {
    const { bases, composition, sequences } = state.samples.detail.quality;

    return {
        bases,
        composition,
        sequences,
    };
};

export default connect(mapStateToProps)(SampleQuality);
