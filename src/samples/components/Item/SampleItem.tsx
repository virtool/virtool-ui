import { useUrlSearchParam } from "../../../app/hooks";
import { Workflows } from "../../../analyses/types";
import { getFontSize, getFontWeight } from "../../../app/theme";
import Attribution from "../../../base/Attribution";
import Box from "../../../base/Box";
import Checkbox from "../../../base/Checkbox";
import Link from "../../../base/Link";
import React from "react";
import styled from "styled-components";
import { SampleMinimal } from "../../types";
import SampleLibraryTypeLabel from "../Label/SampleLibraryTypeLabel";
import SmallSampleLabel from "../Label/SmallSampleLabel";
import WorkflowTags from "../Tag/WorkflowTags";
import EndIcon from "./EndIcon";

const SampleItemCheckboxContainer = styled.div`
    grid-column-start: 1;
    cursor: pointer;
    display: flex;
    padding-right: 15px;
    max-width: 30px;
`;

const SampleItemLabels = styled.div`
    margin-top: 10px;
    & > *:not(:last-child) {
        margin-right: 5px;
    }
`;

const SampleItemData = styled.div`
    grid-column-start: 2;
    display: flex;
    flex: 3;
    flex-direction: column;
    min-width: 250px;
`;

const SampleItemMain = styled.div`
    align-items: center;
    display: flex;
    position: relative;
`;

const SampleItemWorkflows = styled.div`
    grid-column-start: 3;
    display: flex;
    flex: 2;
    white-space: nowrap;
`;

const SampleItemIcon = styled.div`
    display: flex;
    min-width: 80px;
`;

const SampleItemTitle = styled.div`
    display: flex;
    flex-direction: column;
    flex: 3;
    overflow: hidden;

    a {
        font-size: ${getFontSize("lg")};
        font-weight: ${getFontWeight("thick")};
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const StyledSampleItem = styled(Box)`
    align-items: stretch;
    display: flex;
    flex-basis: 0;
`;

type SampleItemProps = {
    /** Minimal sample data */
    sample: SampleMinimal;
    /** Whether the sample is selected */
    checked: boolean;
    /** Callback to handle sample selection */
    handleSelect: () => void;
    /** Callback to handle sample selection on end icon quick analysis */
    selectOnQuickAnalyze: () => void;
};

/**
 * A condensed sample item for use in a list of samples
 */
export default function SampleItem({
    sample,
    checked,
    handleSelect,
    selectOnQuickAnalyze,
}: SampleItemProps) {
    const { setValue: setQuickAnalysisType } =
        useUrlSearchParam<string>("quickAnalysisType");

    function onQuickAnalyze() {
        setQuickAnalysisType(Workflows.pathoscope_bowtie);
        selectOnQuickAnalyze();
    }

    return (
        <StyledSampleItem>
            <SampleItemCheckboxContainer onClick={handleSelect}>
                <Checkbox checked={checked} id={`SampleCheckbox${sample.id}`} />
            </SampleItemCheckboxContainer>

            <SampleItemData>
                <SampleItemMain>
                    <SampleItemTitle>
                        <Link to={`/samples/${sample.id}`}>{sample.name}</Link>
                        <Attribution
                            time={sample.created_at}
                            user={sample.user.handle}
                        />
                    </SampleItemTitle>
                </SampleItemMain>
                <SampleItemLabels>
                    <SampleLibraryTypeLabel libraryType={sample.library_type} />
                    {sample.labels.map((label) => (
                        <SmallSampleLabel {...label} key={label.id} />
                    ))}
                </SampleItemLabels>
            </SampleItemData>
            <SampleItemWorkflows>
                {sample.ready && (
                    <WorkflowTags id={sample.id} workflows={sample.workflows} />
                )}
            </SampleItemWorkflows>
            <SampleItemIcon>
                <EndIcon
                    job={sample.job}
                    onClick={onQuickAnalyze}
                    ready={sample.ready}
                />
            </SampleItemIcon>
        </StyledSampleItem>
    );
}
