import React from "react";
import styled from "styled-components";
import { ContainerSide } from "../../../base";
import SampleLabels from "../Sidebar/Labels";
import DefaultSubtractions from "../Sidebar/Subtractions";

const StyledSidebar = styled(ContainerSide)`
    align-items: stretch;
    flex-direction: column;
    display: flex;
    width: 320px;
    z-index: 1;
`;

type sidebarProps = {
    className?: string;
    sampleLabels: number[];
    defaultSubtractions: string[];
    onUpdate: (key: string, value: any) => void;
};

export function Sidebar({ className, sampleLabels, defaultSubtractions, onUpdate }: sidebarProps) {
    return (
        <StyledSidebar className={className}>
            <SampleLabels onUpdate={selection => onUpdate("labels", selection)} sampleLabels={sampleLabels} />
            <DefaultSubtractions
                onUpdate={selection => onUpdate("subtractionIds", selection)}
                defaultSubtractions={defaultSubtractions}
            />
        </StyledSidebar>
    );
}
