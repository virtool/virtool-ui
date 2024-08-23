import React from "react";
import { useNavigate } from "react-router-dom-v5-compat";
import styled from "styled-components";
import { Workflows } from "../../analyses/types";
import { Button, Icon } from "../../base";

const SampleSelectionToolbarTop = styled.div`
    align-items: center;
    display: flex;
    margin-bottom: 15px;

    button {
        height: 38px;
    }

    button:first-child {
        align-items: center;
        display: flex;
        flex: 1;
        justify-content: flex-start;
        margin-right: 3px;
    }
`;

type SampleSelectionToolbarProps = {
    /** A callback function to clear selected samples */
    onClear: () => void;
    /** A list of selected samples */
    selected: string[];
};

/**
 * A toolbar allowing users to create an analysis for selected samples
 */
export function SampleSelectionToolbar({ onClear, selected }: SampleSelectionToolbarProps) {
    const navigate = useNavigate();

    function onQuickAnalyze() {
        navigate(
            {
                pathname: location.pathname,
                search: location.search,
            },
            { state: { quickAnalysis: true, workflow: Workflows.pathoscope_bowtie } }
        );
    }

    return (
        <SampleSelectionToolbarTop>
            <Button onClick={onClear}>Clear selection of {selected.length} samples</Button>
            <Button color="green" onClick={() => onQuickAnalyze()}>
                <Icon name="chart-area" /> Quick Analyze
            </Button>
        </SampleSelectionToolbarTop>
    );
}
