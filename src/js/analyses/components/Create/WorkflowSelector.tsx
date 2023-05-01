import { concat, difference, without } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { ReferenceDataType } from "../../../references/types";
import { getWorkflowDisplayName } from "../../../utils/utils";
import { CreateAnalysisField } from "./CreateAnalysisField";
import { CreateAnalysisFieldTitle } from "./CreateAnalysisFieldTitle";
import { CreateAnalysisSelected } from "./CreateAnalysisSelected";
import { CreateAnalysisSelector } from "./CreateAnalysisSelector";
import { CreateAnalysisSelectorList } from "./CreateAnalysisSelectorList";
import { SelectorItem } from "./SelectorItem";

export function getCompatibleWorkflows(dataType: ReferenceDataType, hasHmm: boolean): string[] {
    if (dataType === "barcode") {
        return ["aodp"];
    }

    if (hasHmm) {
        return ["pathoscope_bowtie", "nuvs"];
    }

    return ["pathoscope_bowtie"];
}

const ShorterCreateAnalysisSelector = styled(CreateAnalysisSelector)`
    height: 90px;
`;

interface WorkflowSelectorProps {
    dataType: ReferenceDataType;
    hasError: boolean;
    hasHmm: boolean;
    selected: string[];
    onSelect: (selected: string[]) => void;
}

export function WorkflowSelector({ dataType, hasError, hasHmm, selected, onSelect }: WorkflowSelectorProps) {
    const compatibleWorkflows = getCompatibleWorkflows(dataType, hasHmm);
    const unselectedWorkflows = difference(compatibleWorkflows, selected);

    return (
        <CreateAnalysisField>
            <CreateAnalysisFieldTitle>Workflow</CreateAnalysisFieldTitle>
            <ShorterCreateAnalysisSelector>
                <CreateAnalysisSelectorList
                    items={unselectedWorkflows}
                    render={workflow => (
                        <SelectorItem key={workflow} onClick={() => onSelect(concat(selected, workflow))}>
                            {getWorkflowDisplayName(workflow)}
                        </SelectorItem>
                    )}
                />
            </ShorterCreateAnalysisSelector>
            <CreateAnalysisSelected
                items={selected}
                render={workflow => (
                    <SelectorItem key={workflow} onClick={() => onSelect(without(selected, workflow))}>
                        {getWorkflowDisplayName(workflow)}
                    </SelectorItem>
                )}
            />
        </CreateAnalysisField>
    );
}
