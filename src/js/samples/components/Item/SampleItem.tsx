import React from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { Attribution, Box, Checkbox } from "../../../base";
import { JobMinimal } from "../../../jobs/types";
import { LabelNested } from "../../../labels/types";
import { LibraryType, SampleWorkflows } from "../../types";
import { SampleLibraryTypeLabel, SmallSampleLabel } from "../Label";
import { WorkflowTags } from "../Tag/WorkflowTags";
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
    flex-basis: 0px;
`;

type SampleItemProps = {
    /** Whether the sample is selected */
    checked: boolean;
    /** The date the sample was created */
    created_at: string;
    /** The user who created the sample */
    handle: string;
    /** The unique identifier of the sample */
    id: string;
    /** Index of the sample */
    index: number;
    /** Information about the job associated with the sample */
    job?: JobMinimal;
    /** Labels associated with the sample */
    labels: Array<LabelNested>;
    /** Library type associated with the sample */
    library_type: LibraryType;
    /** Name of the sample */
    name: string;
    /** Callback to trigger quick analysis */
    onQuickAnalyze: (id: string) => void;
    /** Callback to handle sample selection */
    onSelect: () => void;
    /** Whether the sample is ready */
    ready: boolean;
    /** Workflows associated with the sample */
    workflows: SampleWorkflows;
    selected: string[];
    select: any;
    document: any;
};

/**
 * A condensed sample item for use in a list of samples
 */
export default function SampleItem({
    id,
    created_at,
    labels,
    library_type,
    name,
    ready,
    workflows,
    handle,
    onSelect,
    select,
    checked,
}: SampleItemProps) {
    const history = useHistory();

    function handleQuickAnalyze() {
        history.push({ state: { quickAnalysis: true } });
        select();
    }

    return (
        <StyledSampleItem>
            <SampleItemCheckboxContainer onClick={onSelect}>
                <Checkbox checked={checked} />
            </SampleItemCheckboxContainer>

            <SampleItemData>
                <SampleItemMain>
                    <SampleItemTitle>
                        <Link to={`/samples/${id}`}>{name}</Link>
                        <Attribution time={created_at} user={handle} />
                    </SampleItemTitle>
                </SampleItemMain>
                <SampleItemLabels>
                    <SampleLibraryTypeLabel libraryType={library_type} />
                    {labels.map(label => (
                        <SmallSampleLabel key={label.id} {...label} />
                    ))}
                </SampleItemLabels>
            </SampleItemData>
            <SampleItemWorkflows>
                <WorkflowTags id={id} workflows={workflows} />
            </SampleItemWorkflows>
            <SampleItemIcon>
                <EndIcon ready={ready} onClick={handleQuickAnalyze} />
            </SampleItemIcon>
        </StyledSampleItem>
    );
}
