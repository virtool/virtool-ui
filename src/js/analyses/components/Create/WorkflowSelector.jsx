import { concat, difference, without } from "lodash-es";
import PropTypes from "prop-types";
import React from "react";
import { getWorkflowDisplayName } from "../../../utils/utils";
import { CreateAnalysisField, CreateAnalysisFieldTitle } from "./Field";
import { CreateAnalysisSelected } from "./Selected";
import { CreateAnalysisSelector } from "./Selector";
import { SelectorItem } from "./SelectorItem";
import { CreateAnalysisSelectorList } from "./CreateAnalysisSelectorList";
import styled from "styled-components";

export const getCompatibleWorkflows = (dataType, hasHmm) => {
    if (dataType === "barcode") {
        return ["aodp"];
    }

    if (hasHmm) {
        return ["pathoscope_bowtie", "nuvs"];
    }

    return ["pathoscope_bowtie"];
};

const ShorterCreateAnalysisSelector = styled(CreateAnalysisSelector)`
    height: 90px;
`;

export const WorkflowSelector = ({ dataType, hasError, hasHmm, selected, onSelect }) => {
    const compatibleWorkflows = getCompatibleWorkflows(dataType, hasHmm);
    const unselectedWorkflows = difference(compatibleWorkflows, selected);

    return (
        <CreateAnalysisField>
            <CreateAnalysisFieldTitle>Workflow</CreateAnalysisFieldTitle>
            <ShorterCreateAnalysisSelector
                error={hasError && "Workflow(s) must be selected"}
                items={unselectedWorkflows}
                noun="workflows"
            >
                <CreateAnalysisSelectorList
                    render={workflow => (
                        <SelectorItem key={workflow} onClick={() => onSelect(concat(selected, workflow))}>
                            {getWorkflowDisplayName(workflow)}
                        </SelectorItem>
                    )}
                    items={unselectedWorkflows}
                    onChange={false}
                />
            </ShorterCreateAnalysisSelector>
            <CreateAnalysisSelected
                render={workflow => (
                    <SelectorItem key={workflow} onClick={() => onSelect(without(selected, workflow))}>
                        {getWorkflowDisplayName(workflow)}
                    </SelectorItem>
                )}
                items={selected}
            />
        </CreateAnalysisField>
    );
};

WorkflowSelector.propTypes = {
    dataType: PropTypes.oneOf(["barcode", "genome"]),
    hasError: PropTypes.bool,
    hasHmm: PropTypes.bool,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func.isRequired
};
