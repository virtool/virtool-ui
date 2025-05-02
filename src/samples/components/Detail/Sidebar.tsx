import { LabelNested } from "../../../labels/types";
import DefaultSubtractions from "../Sidebar/DefaultSubtractions";
import SampleLabels from "../Sidebar/SampleLabels";
import { useUpdateSample } from "../../queries";
import { SubtractionNested } from "../../../subtraction/types";
import React from "react";
import styled from "styled-components";

const StyledSidebar = styled.div`
    align-items: stretch;
    flex-direction: column;
    display: flex;
    width: 320px;
    z-index: 0;
`;

type SidebarProps = {
    sampleId: string;
    sampleLabels: Array<LabelNested>;
    defaultSubtractions: Array<SubtractionNested>;
};

/**
 * Displays the sidebar for managing labels and subtractions associated with sample
 */
export default function Sidebar({
    sampleId,
    sampleLabels,
    defaultSubtractions,
}: SidebarProps) {
    const mutation = useUpdateSample(sampleId);

    return (
        <StyledSidebar>
            <SampleLabels
                onUpdate={(labels) => {
                    mutation.mutate({ update: { labels } });
                }}
                sampleLabels={sampleLabels.map((label) => label.id)}
            />
            <DefaultSubtractions
                onUpdate={(subtractions) => {
                    mutation.mutate({ update: { subtractions } });
                }}
                defaultSubtractions={defaultSubtractions.map(
                    (subtraction) => subtraction.id,
                )}
            />
        </StyledSidebar>
    );
}
