import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../base";

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

export function SampleSelectionToolbar({ onClear, selected }) {
    const history = useHistory();
    function onQuickAnalyze() {
        history.push({ ...history.location, state: { quickAnalysis: true } });
    }

    return (
        <SampleSelectionToolbarTop>
            <Button icon="times-circle" onClick={onClear}>
                Clear selection of {selected.length} samples
            </Button>
            <Button color="green" icon="chart-area" onClick={() => onQuickAnalyze(selected)}>
                Quick Analyze
            </Button>
        </SampleSelectionToolbarTop>
    );
}
