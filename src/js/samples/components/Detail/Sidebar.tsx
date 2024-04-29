import { LabelNested } from "@labels/types";
import { samplesQueryKeys, useUpdateSample } from "@samples/queries";
import { SubtractionShortlist } from "@subtraction/types";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import styled from "styled-components";
import SampleLabels from "./../Sidebar/Labels";
import DefaultSubtractions from "./../Sidebar/Subtractions";

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
    defaultSubtractions: Array<SubtractionShortlist>;
};

/**
 * Displays the sidebar for managing labels and subtractions associated with sample
 */
export default function Sidebar({ sampleId, sampleLabels, defaultSubtractions }: SidebarProps) {
    const mutation = useUpdateSample(sampleId);
    const queryClient = useQueryClient();

    return (
        <StyledSidebar>
            <SampleLabels
                onUpdate={labels => {
                    mutation.mutate(
                        { update: { labels } },
                        {
                            onSuccess: () => {
                                queryClient.invalidateQueries(samplesQueryKeys.detail(sampleId));
                            },
                        },
                    );
                }}
                sampleLabels={sampleLabels.map(label => label.id)}
            />
            <DefaultSubtractions
                onUpdate={subtractions => {
                    mutation.mutate(
                        { update: { subtractions: subtractions } },
                        {
                            onSuccess: () => {
                                queryClient.invalidateQueries(samplesQueryKeys.detail(sampleId));
                            },
                        },
                    );
                }}
                defaultSubtractions={defaultSubtractions.map(subtraction => subtraction.id)}
            />
        </StyledSidebar>
    );
}
